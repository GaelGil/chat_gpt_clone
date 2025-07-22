"""A class representing an AI agent"""

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
        """Initialize agent instace

        Args:
            dev_prompt: The developer prompt
            client: The mcp client
            api_key: The api key for our openai model
            model_name: The name of the openai model we are using
            max_turns: The max number of turns for the agent to take
            tools: The tools available to the agent

        Returns:
            None
        """
        self.dev_prompt: dict = dev_prompt
        self.client: MCPClient = client
        self.llm = LLM(model_name=model_name, api_key=api_key)
        self.max_turns: int = max_turns
        self.tools: list = tools
        self.messages: dict
        if self.dev_prompt:
            self.messages.append({"role": "developer", "content": self.dev_prompt})

    def __call__(self, message: str):
        """"""
        if message:
            self.messages.append({"role": "user", "content": message})
        response = self.llm.create_response(self.messages, self.tools)
        self.messages.append({"role": "assitant", "content": response.output})
        return response

    async def call_tool(self, name, args):
        """
        Args:
            name: The name of the tool we are calling

            args:
                The arguments for the tool

        Returns:
            Any
        """
        if name in self.tools:
            result = await self.call_tool(name, args)
        return result

    def run(self, query: str):
        """Function to run the agent

        Args:
            query: The query sent to the agent

        Returns:
            None
        """
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
