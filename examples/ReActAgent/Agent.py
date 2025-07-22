""""""

from LLM import LLM
from MCPClient import MCPClient
import json


class Agent:
    """"""

    def __init__(
        self,
        dev_prompt: str,
        client: MCPClient,
        api_key: str,
        model_name: str = "gpt-4.1-mini",
        max_turns: int = 1,
        tools: list = [],
    ):
        """"""
        self.dev_prompt: dict = dev_prompt
        self.client: MCPClient = client
        self.llm = LLM(model_name=model_name, api_key=api_key)
        self.max_turns: int = max_turns
        self.tools: list = tools
        self.messages: dict

    def __call__(self, message: str):
        """"""
        if message:
            # self.llm.add_message({"role": "user", "content": message})
            self.messages.append({"role": "user", "content": message})
            result = self.llm.create_response
            result = self.llm.create_response()
            self.llm.add_message({"role": "assitant", "content": result})
        return result

    async def call_tool(self, name, args):
        """"""
        if name in self.tools:
            result = await self.call_tool(name, args)
        return result

    def run(self, query: str):
        """"""
        i = 0
        prompt = query
        while i < self.max_turns:
            i += 1
            response = self.llm(prompt)

            for tool_call in response.output:
                if tool_call.type != "function_call":
                    continue

                name = tool_call.name
                args = json.loads(tool_call.arguments)
                # add the tool call message to the llm messages
                self.llm.add_message(tool_call)

                # call tool and get result
                result = self.call_tool(name, args)

                # add the result of the tool call
                self.llm.add_message(
                    {
                        "type": "function_call_output",
                        "call_id": tool_call.call_id,
                        "output": str(result),
                    }
                )
