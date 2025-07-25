from collections.abc import AsyncGenerator
from openai import OpenAI


class PlannerAgent:
    def __init__(
        self,
        dev_prompt,
        mcp_client,
        llm,
        messages,
        max_turns,
        tools,
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
        self.messages.append({"role": "user", "content": prompt})

    async def decide_tool(self, prompt: str, called_tools: list[dict]):
        """Decide which tool to use to answer the question.

        Args:
            question (str): The question to answer.
            called_tools (list[dict]): The tools that have been called.
        """
        if self.mcp_url is None:
            return self.call_llm(prompt)
        tool_prompt = await get_mcp_tool_prompt(self.mcp_url)
        if called_tools:
            called_tools_prompt = called_tools_history_template.render(
                called_tools=called_tools
            )
        else:
            called_tools_prompt = ""

        prompt = decide_template.render(
            question=question,
            tool_prompt=tool_prompt,
            called_tools=called_tools_prompt,
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

            called_tools += [
                {
                    "tool": tool["name"],
                    "arguments": tool["arguments"],
                    "isError": result.isError,
                    "result": result.content[0].text,
                }
                for tool, result in zip(tools, results, strict=True)
            ]
            called_tools_history = called_tools_history_template.render(
                called_tools=called_tools, question=question
            )
            yield {
                "is_task_complete": False,
                "require_user_input": False,
                "content": called_tools_history,
            }

        yield {
            "is_task_complete": True,
            "require_user_input": False,
            "content": "Task completed",
        }
