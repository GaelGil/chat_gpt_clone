from Model import LLM
from MCPClient import MCPClient
import json


class Agent:
    def __init__(
        self, dev_prompt: str, client: MCPClient, max_turns: int = 1, tools: list = []
    ):
        self.llm = LLM(dev_prompt=dev_prompt)
        self.client: MCPClient = client
        self.max_turns: int = max_turns
        self.tools: list = tools

    async def call_tool(self, name, args):
        if name in self.tools:
            result = await self.call_tool(name, args)
        return result

    def run(self, query: str):
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
                messages.append(tool_call)
                result = self.call_tool(name, args)
                print(response)
                messages.append(
                    {
                        "type": "function_call_output",
                        "call_id": tool_call.call_id,
                        "output": str(result),
                    }
                )
