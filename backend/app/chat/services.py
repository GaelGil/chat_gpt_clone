import os  # type: ignore
import json
from openai import OpenAI
from pathlib import Path
from dotenv import load_dotenv
from composio import Composio  # type: ignore
from app.chat.agent.PlannerAgent import PlannerAgent  # type: ignore
from app.chat.agent.prompts import PLANNER_AGENT_PROMPT
from app.chat.agent.OpenAIClient import OpenAIClient
from app.chat.agent.MCP.client import MCPClient

# from app.chat.agent.Executor import Executor
from app.chat.agent.schemas import Plan, ToolCall, PlannerTask, NextStep
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

    async def init_chat_services(self):
        print("Initializing MCP client ...")
        self.mcp_client = MCPClient()
        await self.mcp_client.connect()

        print("Getting tools from MCP ...")
        self.tools = await self.mcp_client.get_tools()
        print(f"Loaded {len(self.tools)} tools from MCP")
        print(f"Tools: {self.tools} \n")

        print("Initializing OpenAI client ...")
        self.llm = OpenAIClient(api_key=os.getenv("OPENAI_API_KEY")).get_client()

        print("Initializing Planner Agent ...")
        self.planner = PlannerAgent(
            dev_prompt=PLANNER_AGENT_PROMPT,
            llm=self.llm,
            messages=[],
            tools=self.tools,
            model_name="gpt-4.1-mini",
        )

    async def process_message(self, user_message: str):
        """
        Process a user message using the agent's multiple_tool_calls_with_thinking logic.
        Returns structured response data for the frontend.
        """
        print("\n=== CHAT SERVICE: Processing new message ===")
        print(f"User message: {user_message}")
        print(f"Model: {self.model_name}")
        try:
            print("\n--- Making initial API call to OpenAI ---")
            # response: ParsedResponse[Plan] = self.planner.plan(user_message)
            response: ParsedResponse[NextStep] = self.llm.responses.parse(
                model=self.model_name,
                input=self.planner.messages,
                tools=self.tools,
                text_format=NextStep,
            )

            print(f"Initial response content blocks: {len(response.output_parsed)}")

            # Process the response and handle tool calls
            conversation_history = [{"role": "user", "content": user_message}]
            print(
                f"Starting conversation history with {len(conversation_history)} messages"
            )
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
        self, response: Plan, conversation_history: list[dict]
    ):
        """
        Handle the full response chain including tool calls, following agent.py logic.
        Returns structured response data.
        """
        print("\n--- Starting response chain handling ---")
        response_blocks = []
        iteration = 0

        results = [
            {
                "task": "No task yet",
                "results": "No task results yet",
            }
        ]  # list to hold results of each task execution.
        for i in range(len(response.tasks)):  # iterate through tasks
            task: PlannerTask = response.tasks[i]  # select the task
            current_blocks = []
            current_blocks.append(
                {
                    "type": "thinking",
                    "content": task.thought,
                    "iteration": i,
                }
            )
            current_blocks.append(
                {
                    "type": "tool_calls",
                    "task": task.description,
                    "tool_name": task.tool_calls,
                    "iteration": i,
                }
            )

            response_blocks.extend(current_blocks)
            print(f"Added {len(current_blocks)} blocks to response")

            assistant_blocks = []

            for j in range(len(response.tasks)):  # iterate through tasks
                task: PlannerTask = response.tasks[j]  # select the task
                assistant_blocks.append(task.thought, task.tool_calls)

            conversation_history.append(
                {"role": "assistant", "content": assistant_blocks}
            )

            tool_use_blocks: list[dict] = []

            for x in range(len(response.tasks)):  # iterate through tasks
                task: PlannerTask = response.tasks[x]  # select the task
                for y in range(len(task.tool_calls)):  # iterate through tools calls
                    tool_call = task.tool_calls[y]  # seelct the tool call
                    tool: dict = self.extract_tools(tool_call)
                    tool_use_blocks.append(tool)  # add tool call to tool use blocks

            if tool_use_blocks:
                print(f"*** TOOL EXECUTION ({len(tool_use_blocks)} tools) ***")
                # If we received an error message instead of tool calls
                if isinstance(tool_use_blocks, str):
                    return [{"error": True, "message": tool_use_blocks}]

                # # Ensure tool_calls is a list
                if not isinstance(tool_use_blocks, list):
                    return [
                        {
                            "error": True,
                            "message": f"Expected list of tool calls, got {type(tool_use_blocks).__name__}",
                        }
                    ]
                    # Collect all tool results
                tool_results_content = []

                for tool_use_block in tool_use_blocks:
                    name = tool_use_block["name"]
                    arguments = tool_use_block["arguments"]
                    print(f"Tool name: {name}")
                    print(f"Tool input: {arguments}")

                    if not name:
                        results.append(
                            {"error": True, "message": "Tool call missing 'name' field"}
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
                        }
                    )

                    # Collect tool result for conversation history
                    tool_results_content.append(
                        {
                            "type": "tool_result",
                            "tool_use_id": tool_use_block.id,
                            "content": json.dumps(result),
                        }
                    )

                print("Added all tool results to response blocks")

                # Add ALL tool results to conversation in a single message
                conversation_history.append(
                    {
                        "role": "user",
                        "content": tool_results_content,
                    }
                )
                print(
                    f"Added {len(tool_results_content)} tool results to conversation history. Total messages: {len(conversation_history)}"
                )

                # Continue the conversation
                print("*** CONTINUING CONVERSATION AFTER TOOL USE ***")
                response = self.llm.responses.create(
                    model=self.model_name,
                    tools=self.tools,
                    system=PLANNER_AGENT_PROMPT,
                    input=conversation_history,
                    text_format=NextStep,
                )
            else:
                print("No tool_use block found, breaking loop")
                break

        # Handle final response (no more tool use)
        print("\n*** FINAL RESPONSE PROCESSING ***")
        print(f"Final stop reason: {response.stop_reason}")
        if response.step != "continue":
            final_blocks = []
            for block in response.content:
                if block.type == "thinking":
                    final_blocks.append(
                        {
                            "type": "thinking",
                            "content": block.thinking,
                            "iteration": iteration + 1,
                        }
                    )
                elif block.type == "redacted_thinking":
                    final_blocks.append(
                        {
                            "type": "redacted_thinking",
                            "content": "[Thinking content redacted]",
                            "iteration": iteration + 1,
                        }
                    )
                elif block.type == "text":
                    final_blocks.append(
                        {
                            "type": "text",
                            "content": block.text,
                            "iteration": iteration + 1,
                        }
                    )

            response_blocks.extend(final_blocks)
            print(f"Added {len(final_blocks)} final blocks to response")

        print("\n--- Response chain handling complete ---")
        print(f"Total response blocks: {len(response_blocks)}")
        print(f"Total iterations: {iteration + 1}")

        return {
            "blocks": response_blocks,
            "stop_reason": response.stop_reason,
            "total_iterations": iteration + 1,
        }

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

        return tool
