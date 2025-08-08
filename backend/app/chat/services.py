import os  # type: ignore
from openai import OpenAI
from pathlib import Path
from dotenv import load_dotenv
from composio import Composio  # type: ignore
from app.chat.agent.PlannerAgent import PlannerAgent  # type: ignore
from app.chat.agent.prompts import PLANNER_AGENT_PROMPT
from app.chat.agent.OpenAIClient import OpenAIClient
from app.chat.agent.MCP.client import MCPClient
from app.chat.agent.schemas import Plan, ToolCall, PlannerTask
from openai.types.responses import ParsedResponse

load_dotenv(Path("../../.env"))


class ChatService:
    def __init__(self):
        # Initialize the Anthropic client
        self.planner: PlannerAgent = None
        self.mcp_client: MCPClient = None
        self.llm: OpenAI = None
        self.tools = None
        self.model_name: str = "gpt-4.1-mini"
        self.composio = Composio()
        self.user_id = "0000-1111-2222"
        self.plan_copy: Plan
        self.previous_task_results: list[dict] = [
            {
                "task_id": "0",
                "task": "first task, no previous task yet",
                "results": "first task, no results yet",
            }
        ]

    def init_chat_services(self):
        print("Initializing OpenAI client ...")
        self.llm = OpenAIClient(api_key=os.getenv("OPENAI_API_KEY")).get_client()

        print("Initializing Planner Agent ...")
        self.planner = PlannerAgent(
            dev_prompt=PLANNER_AGENT_PROMPT,
            llm=self.llm,
            messages=[],
        )

    async def process_message(self, user_message: str):
        """
        Process a user message using the agent's multiple_tool_calls_with_thinking logic.
        Returns structured response data for the frontend.
        """
        print("Initializing MCP client ...")
        self.mcp_client = MCPClient()
        await self.mcp_client.connect()
        print("Getting tools from MCP ...")
        self.tools = await self.mcp_client.get_tools()
        print(f"Loaded {len(self.tools)} tools from MCP")
        print(f"Tools: {self.tools} \n")
        self.planner.set_tools(self.tools)

        print("\n=== CHAT SERVICE: Processing new message ===")
        print(f"User message: {user_message}")
        print(f"Model: {self.model_name}")
        try:
            print("\n--- Making initial API call to OpenAI ---")
            # response: ParsedResponse[Plan] = self.planner.plan(user_message)
            response: ParsedResponse[Plan] = self.planner.plan(user_message)

            print(
                f"Initial response content blocks: {len(response.output_parsed.tasks)}"
            )

            # Process the response and handle tool calls
            conversation_history = [{"role": "user", "content": user_message}]
            print(
                f"Starting conversation history with {len(conversation_history)} messages"
            )
            self.plan_copy = response.output_parsed
            final_response = await self._handle_response_chain(
                response.output_parsed, conversation_history
            )

            print("\n=== CHAT SERVICE: Processing complete ===")
            print(f"Final response blocks: {len(final_response.get('blocks', []))}")
            print(f"Total iterations: {final_response.get('total_iterations', 0)}")
            print(f"Stop reason: {final_response.get('stop_reason', 'unknown')}")

            return {"success": True, "response": final_response}

        except Exception as e:
            print("\n!!! CHAT SERVICE ERROR !!!")
            print(f"Error type: {type(e).__name__}")
            print(f"Error message: {str(e)}")
            import traceback

            print(f"Traceback: {traceback.format_exc()}")
            return {"success": False, "error": str(e)}

    async def _handle_response_chain(
        self, plan: Plan, conversation_history: list[dict]
    ):
        """
        Handle the full response chain including tool calls, following agent.py logic.
        Returns structured response data.
        """

        response_blocks = []
        iteration = 0

        while plan.tasks:
            iteration += 1
            # Take the next task to execute and remove it from plan.tasks
            task: PlannerTask = plan.tasks.pop(0)
            for tool_call in task.tool_calls:
                # Record thinking and tool_calls for this task
                current_blocks = [
                    {
                        "type": "thinking",
                        "content": task.thought,
                        "iteration": iteration,
                    },
                    {
                        "type": "tool_calls",
                        "task": task.description,
                        "tool_name": tool_call.name,
                        "iteration": iteration,
                    },
                ]
                response_blocks.extend(current_blocks)
                print(f"Added {len(current_blocks)} blocks to response")

                # Add assistant's "thinking" + "tool_calls" to conversation history
                conversation_history.append(
                    {
                        "role": "assistant",
                        "content": [
                            task.thought,
                            tool_call.name,
                            tool_call.arguments,
                        ],
                    }
                )

            # Extract tool calls for this task
            tool_use_blocks: list[dict] = []
            for tool_call in task.tool_calls:
                tool: dict = self.extract_tools(tool_call)
                tool_use_blocks.append(tool)

            if tool_use_blocks:
                print(f"*** TOOL EXECUTION ({len(tool_use_blocks)} tools) ***")

                if isinstance(tool_use_blocks, str):
                    return [{"error": True, "message": tool_use_blocks}]

                if not isinstance(tool_use_blocks, list):
                    return [
                        {
                            "error": True,
                            "message": f"Expected list of tool calls, got {type(tool_use_blocks).__name__}",
                        }
                    ]

                tool_results_content = []

                for tool_use_block in tool_use_blocks:
                    name = tool_use_block.get("name")
                    arguments = tool_use_block.get("arguments")
                    print(f"Tool name: {name}")
                    print(f"Tool input: {arguments}")

                    if not name:
                        response_blocks.append(
                            {
                                "type": "tool_result",
                                "tool_name": "None",
                                "tool_input": "None",
                                "tool_result": "None",
                                "iteration": iteration,
                            }
                        )
                        continue

                    # Call the tool through MCP client
                    result = await self.mcp_client.call_tool(name, arguments)

                    response_blocks.append(
                        {
                            "type": "tool_result",
                            "tool_name": name,
                            "tool_input": arguments,
                            "tool_result": result,
                            "iteration": iteration,
                        }
                    )

                    tool_results_content.append(
                        {
                            "type": "tool_result",
                            "content": result,
                        }
                    )

                print("Added all tool results to response blocks")

                # Add tool results to conversation history
                conversation_history.append(
                    {
                        "role": "user",
                        "content": tool_results_content,
                    }
                )
                print(
                    f"Added {len(tool_results_content)} tool results to conversation history. "
                    f"Total messages: {len(conversation_history)}"
                )
                # get the results only
                results = [
                    result["content"]
                    for result in tool_results_content
                    if "content" in result
                ]

                self.previous_task_results.append(
                    {
                        "task_id": task.id,
                        "task": task.description,
                        "results": results,
                    }
                )

            else:
                print("No tool_use block found for this task.")

        # Final response when all tasks are done
        print("\n*** FINAL RESPONSE PROCESSING ***")
        print("Final stop reason: 0 tasks remaining")

        # Optionally re-list all thinking/tool_calls from original plan copy
        final_blocks = []
        for original_task in self.plan_copy.tasks:
            final_blocks.append(
                {
                    "type": "thinking",
                    "content": original_task.thought,
                    "iteration": iteration,
                }
            )
            final_blocks.append(
                {
                    "type": "tool_calls",
                    "task": original_task.description,
                    "tool_name": original_task.tool_calls,
                    "iteration": iteration,
                }
            )

        response_blocks.extend(final_blocks)
        print(f"Added {len(final_blocks)} final blocks to response")

        print("\n--- Response chain handling complete ---")
        print(f"Total response blocks: {len(response_blocks)}")
        print(f"Total iterations: {iteration}")

        return {
            "blocks": response_blocks,
            "stop_reason": "0 tasks remaining",
            "total_iterations": iteration,
        }

    def format_tasks_results_markdown(self) -> str:
        """Format the task results as markdown

        Args:
            task_results: The task results to format.

        Returns:
            str: The formatted task results as markdown.
        """
        output = []
        for i in range(len(self.previous_task_results)):
            task_result = self.previous_task_results[i]
            task_result_formated = f""" 
                ## Task id: {task_result["task_id"]}
                - **Task** {task_result["task"]}
                - **Result:** {task_result["results"]}  
                """
            output.append(task_result_formated)
        return "\n".join(output)

    def extract_tools(self, tool_call: ToolCall) -> dict:
        """
        Extracts tool name and its arguments from a tool_call object,
        and returns a dictionary with the tool name and arguments
        Args:
            tool_call: ToolCall object
        Returns:
            dict: Dictionary with tool name and arguments
        """
        name = tool_call.name.split(".")[-1]

        tool = {"name": name, "arguments": {}}

        keys = tool_call.arguments.keys
        values = tool_call.arguments.values
        print(f"EXTRACT_TOOLS: name: \n {name} \n keys: {keys} \n values: {values}\n")
        if len(keys) != len(values):
            raise ValueError(
                f"Tool call argument mismatch: keys={keys}, values={values}"
            )

        for key, value in zip(keys, values):
            # --- Tool-specific overrides ---
            if name in ("review_tool", "assemble_content") and key == "content":
                tool["arguments"]["content"] = self.format_tasks_results_markdown()

            elif name == "writer_tool":
                if key == "content":
                    tool["arguments"]["context"] = self.format_tasks_results_markdown()
                elif key == "query":
                    tool["arguments"]["query"] = value
                else:
                    tool["arguments"][key] = value

            elif name == "save_txt":
                if key == "text":
                    tool["arguments"]["text"] = str(self.previous_task_results)
                elif key == "filename":
                    tool["arguments"]["filename"] = value
                else:
                    tool["arguments"][key] = value

            # --- Default fallback ---
            else:
                tool["arguments"][key] = value

        print(f"EXTRACTED_TOOLS: \n {tool}")
        return tool
