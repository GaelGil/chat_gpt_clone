from collections.abc import AsyncGenerator
from openai import OpenAI
from MCP.client import MCPClient
from helpers.schemas import ToolHistoryResponse, DecideResposnse

# import asyncio
import json


class OrchestratorAgent:
    def __init__(
        self,
        dev_prompt: str,
        mcp_client: MCPClient,
        llm: OpenAI,
        messages: list[dict],
        max_turns: int,
        tools: list[dict],
        model_name: str = "gpt-4.1-mini",
    ):
        self.model_name = model_name
        self.dev_prompt = dev_prompt
        self.mcp_client = mcp_client
        self.llm = llm
        self.max_turns = max_turns
        self.messages = messages
        self.tools = tools
        if self.dev_prompt:
            self.messages.append({"role": "developer", "content": self.dev_prompt})

    def plan(self):
        """Create a workflow plan based on the current state of the system."""

        pass

    def stream_llm(self):
        """Stream LLM response.

        Args:
            prompt (str): The prompt to send to the LLM.

        Returns:
            Generator[str, None, None]: A generator of the LLM response.
        """
        stream = self.llm.responses.create(
            model=self.model_name, input=self.messages, stream=True
        )
        for event in stream:
            yield event

    def add_messages(self, prompt: str):
        """Add a message to the LLM's input messages.

        Args:
            prompt (str): The prompt to add to the LLM's input messages.

        Returns:
            None
        """
        self.messages.append({"role": "user", "content": prompt})

    async def call_tool(self, tool_calls: list[dict]) -> list[dict]:
        """Call the tool.

        Args:
            tools (list[dict]): The tools to call.
        """
        results = []
        for i in range(len(tool_calls)):
            name = tool_calls[i]["name"]
            args = tool_calls[i]["arguments"]
            result = await self.mcp_client.call_tool(name, args)
            results.append({"name": name, "result": result})
        return results

    def extract_tools(self, response: str) -> list[dict] | str:
        """Extract the tool calls from the response. Set a tool call list containing tool name and arguments

        Args:
            response (str): The response from the LLM.

        Returns:
            list[dict]: List of tools
        """
        tool_calls: list[dict] = []
        for tool_call in response.output:
            if tool_call.type != "function_call":
                continue
            # select tool name
            name = tool_call.name
            # get the arguments for the tool
            args = json.loads(tool_call.arguments)

            tool_calls.append({"name": name, "arguments": args})
        if not tool_calls:
            return "No tools called"
        return tool_calls

    async def decide(self, question: str, called_tools: list[dict] | None = None):
        """Decide which tool to use to answer the question.

        Args:
            question (str): The question to answer.
            called_tools (list[dict]): The tools that have been called.
        """
        if self.mcp_url is None:
            return self.call_llm(question)
        tool_prompt = await get_mcp_tool_prompt(self.mcp_url)
        if called_tools:
            called_tools_prompt = self.llm.responses.parse(
                model=self.model_name,
                input=[
                    {
                        "role": "user",
                        "content": question,
                    },
                    {
                        "role": "assistant",
                        "content": called_tools,
                    },
                ],
                text_format=ToolHistoryResponse,
            )
        else:
            called_tools_prompt = ""

        prompt = self.llm.responses.parse(
            model=self.model_name,
            input=[
                {
                    "role": "user",
                    "content": question,
                },
                {
                    "role": "assistant",
                    "content": tool_prompt,
                },
                {
                    "role": "assistant",
                    "content": called_tools_prompt,
                },
            ],
            text_format=DecideResposnse,
        )

        return self.call_llm(prompt)

    async def stream(self, question: str) -> AsyncGenerator[str]:
        """Stream the process of answering a question, possibly involving tool calls.

        Args:
            question (str): The question to answer.

        Yields:
            dict: Streaming output, including intermediate steps and final result.
        """
        called_tools = []
        for i in range(10):
            yield {
                "is_task_complete": False,
                "require_user_input": False,
                "content": f"Step {i}",
            }

            response = ""
            for chunk in await self.decide(question, called_tools):
                response += chunk
                yield {
                    "is_task_complete": False,
                    "require_user_input": False,
                    "content": chunk,
                }
            tools = self.extract_tools(response)

            if not tools:
                break
            results = await self.call_tool(tools)

            for i in range(len(results)):
                called_tools.append(
                    {
                        "tool": tools[i]["name"],
                        "arguments": tools[i]["arguments"],
                        "isError": results[i].isError,
                        "result": results[i].content[0].text,
                    }
                )

            called_tools_history = self.llm.responses.parse(
                model=self.model_name,
                input=[
                    {
                        "role": "user",
                        "content": question,
                    },
                    {
                        "role": "assistant",
                        "content": called_tools,
                    },
                ],
                text_format=ToolHistoryResponse,
            )

            parsed: ToolHistoryResponse = called_tools_history.parsed

            yield {
                "is_task_complete": False,
                "require_user_input": False,
                "content": parsed,
            }

        yield {
            "is_task_complete": True,
            "require_user_input": False,
            "content": "Task completed",
        }
