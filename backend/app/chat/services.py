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

    def process_message(self, user_message: str):
        """
        Process a user message using the agent's multiple_tool_calls_with_thinking logic.
        Returns structured response data for the frontend.
        """
        print("\n=== CHAT SERVICE: Processing new message ===")
        print(f"User message: {user_message}")
        print(f"Model: {self.model_name}")
        try:
            print("\n--- Making initial API call to OpenAI ---")
            response: ParsedResponse[Plan] = self.planner.plan(user_message)

            print(
                f"Initial response content blocks: {len(response.output_parsed.tasks)}"
            )

            # Process the response and handle tool calls
            conversation_history = [{"role": "user", "content": user_message}]
            print(
                f"Starting conversation history with {len(conversation_history)} messages"
            )
            final_response = self._handle_response_chain(
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

    def _handle_response_chain(self, response: Plan, conversation_history: list[dict]):
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
            for i in range(len(response.tasks)):  # iterate through tasks
                task: PlannerTask = response.tasks[i]  # select the task
                assistant_blocks.append(task.thought, task.tool_calls)

            conversation_history.append(
                {"role": "assistant", "content": assistant_blocks}
            )

            tool_use_blocks = []

            for i in range(len(response.tasks)):
                task: PlannerTask = response.tasks[i]  # select the task

            tool_use_blocks = [
                block for block in response.content if block.type == "tool_use"
            ]
            if tool_use_blocks:
                print(f"*** TOOL EXECUTION ({len(tool_use_blocks)} tools) ***")

                # Collect all tool results
                tool_results_content = []

                for tool_use_block in tool_use_blocks:
                    print(f"Tool name: {tool_use_block.name}")
                    print(f"Tool input: {tool_use_block.input}")
                    print(f"Tool ID: {tool_use_block.id}")

                    # Execute the tool
                    tool_result = self._execute_tool(
                        tool_use_block.name, tool_use_block.input
                    )
                    print(f"Tool execution result: {tool_result}")

                    # Add tool result to response blocks
                    response_blocks.append(
                        {
                            "type": "tool_result",
                            "tool_name": tool_use_block.name,
                            "tool_input": tool_use_block.input,
                            "tool_result": tool_result,
                            "iteration": iteration,
                        }
                    )

                    # Collect tool result for conversation history
                    tool_results_content.append(
                        {
                            "type": "tool_result",
                            "tool_use_id": tool_use_block.id,
                            "content": json.dumps(tool_result),
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
                response = self.client.messages.create(
                    model=self.model_name,
                    max_tokens=self.max_tokens,
                    thinking={
                        "type": "enabled",
                        "budget_tokens": self.thinking_budget_tokens,
                    },
                    tools=self.tools,
                    system=self.system_prompt,
                    messages=conversation_history,
                )
            else:
                print("No tool_use block found, breaking loop")
                break

        # Handle final response (no more tool use)
        print("\n*** FINAL RESPONSE PROCESSING ***")
        print(f"Final stop reason: {response.stop_reason}")
        if response.stop_reason != "tool_use":
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

    def _execute_tool(self, tool_name, tool_input):
        """Execute a tool and return the result."""
        print(f"\n+++ EXECUTING TOOL: {tool_name} +++")
        print(f"Tool input: {tool_input}")
        print(f"Tool input type: {type(tool_input)}")

        try:
            if tool_name == "analyze_user_account":
                print(f"MOCK USER DATA: {mock_user_data[0]}")
                result = analyze_user_account()
                # Return structured artifact for frontend
                user_analysis_data = result.model_dump()

                # Calculate summary metrics from account data
                total_balance = 0
                for account in user_analysis_data.get("account_analysis", []):
                    # Extract balance from analysis string
                    analysis = account.get("analysis", "")
                    balance_match = re.search(r"balance \$?([\d,]+\.?\d*)", analysis)
                    if balance_match:
                        balance = float(balance_match.group(1).replace(",", ""))
                        total_balance += balance
                        account["balance"] = balance

                    # Extract counts from analysis string
                    expense_match = re.search(r"(\d+) expenses?", analysis)
                    if expense_match:
                        account["expense_count"] = int(expense_match.group(1))

                    deposit_match = re.search(r"(\d+) deposits?", analysis)
                    if deposit_match:
                        account["deposit_count"] = int(deposit_match.group(1))

                user_analysis_data["total_balance"] = total_balance
                user_analysis_data["total_accounts"] = len(
                    user_analysis_data.get("account_analysis", [])
                )

                print(f"Structured user analysis data: {user_analysis_data}")
                return {"user_analysis": user_analysis_data}
            elif tool_name == "analyze_results":
                result = analyze_results(tool_input["results"])
                # Return the ToolResultsAnalysis object as a dict for JSON serialization
                return {"analysis_results": result.model_dump()}
            print("Executing Composio tool for non-weather request")
            print(f"User ID: {self.user_id}")
            composio = Composio()
            result = composio.tools.execute(
                slug=tool_name,
                user_id=self.user_id,
                arguments=tool_input,
            )
            print(f"Raw Composio result: {result}")
            print(f"Composio result type: {type(result)}")

            # Parse results using appropriate parser based on tool name
            if "finance" in tool_name.lower():
                parsed_result = parse_composio_finance_search_results(result)
                print("Used finance search parser")
            elif "news" in tool_name.lower():
                parsed_result = parse_composio_news_search_results(result)
                print("Used news search parser")
            elif "event" in tool_name.lower():
                parsed_result = parse_composio_event_search_results(result)
                print("Used event search parser")
            else:
                # Default to general search parser
                parsed_result = parse_composio_search_results(result)
                print("Used general search parser")

            print(f"Parsed result: {parsed_result}")
            return {"search_results": parsed_result}

        except Exception as e:
            error_msg = f"Tool execution failed: {str(e)}"
            print("!!! TOOL EXECUTION EXCEPTION !!!")
            print(f"Error type: {type(e).__name__}")
            print(f"Error message: {str(e)}")
            import traceback

            print(f"Traceback: {traceback.format_exc()}")
            return {"error": error_msg}

    async def call_tools(self, tool_calls: list[dict]) -> list[dict]:
        """Receives a list of tool calls and calls the tools

        Args:
            tool_calls: Either a list of tool call dicts or a string error message

        Returns:
            list[dict]: The results of the tool calls or error information
        """
        # If we received an error message instead of tool calls
        if isinstance(tool_calls, str):
            return [{"error": True, "message": tool_calls}]

        # # Ensure tool_calls is a list
        if not isinstance(tool_calls, list):
            return [
                {
                    "error": True,
                    "message": f"Expected list of tool calls, got {type(tool_calls).__name__}",
                }
            ]
        results = []  # Tool call results
        print("CALLING_TOOLS ... ")
        for tool in tool_calls:  # For each tool
            try:  # Try to call the tool
                if not isinstance(tool, dict):  # If tool is not a dict return error
                    results.append(
                        {
                            "error": True,
                            "message": f"Expected dict, got {type(tool).__name__}",
                        }
                    )
                    continue
                # Extract tool name and arguments
                name = tool["name"]
                arguments = tool["arguments"]
                self.print_tool_calll(tool)
                if not name:
                    results.append(
                        {"error": True, "message": "Tool call missing 'name' field"}
                    )
                    continue

                # Call the tool through MCP client
                result = await self.mcp_client.call_tool(name, arguments)
                # append tool call reults. Includes name, arguments, and result
                results.append({"result": result})
                self.tool_call_history.append(
                    {
                        "name": name,
                        "arguments": arguments,
                        "result": result,
                        "error": False,
                    }
                )

            # Handle exceptions
            except Exception as e:
                results.append(
                    {
                        "error": True,
                        "name": name if "name" in locals() else "unknown",
                        "message": f"Error calling tool: {str(e)}",
                    }
                )
        print(f"TOOL CALL RESULTS: {results}")
        return results

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
