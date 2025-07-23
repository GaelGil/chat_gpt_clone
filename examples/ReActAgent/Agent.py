"""A class representing an AI agent"""

from LLM import LLM
from MCPClient import MCPClient

# import re
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
        self.messages: list[dict] = []
        self.tool_names = [t["name"] for t in tools]

        if self.dev_prompt:
            self.messages.append({"role": "developer", "content": self.dev_prompt})

    def call_model(self, message: str = ""):
        """"""
        if message:
            self.messages.append({"role": "user", "content": message})
        response = self.llm.create_response(self.messages, self.tools)
        self.messages.append({"role": "assistant", "content": response.output})
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
        if name in self.tool_names:
            result = await self.client.call_tool(tool_name=name, arguments=args)
            return result

    async def run(self, question: str):
        i = 0
        next_prompt = question
        while i < self.max_turns:
            i += 1
            response = self.call_model(next_prompt)

            if response.output_text:
                print("Model said:", response.output_text)
            print(f"MESSAGES: {self.messages}")

            # proccess function calls
            for item in response.output:
                if item.type == "function_call":
                    # get tool name
                    name = item.name
                    # get the arguments for the tool
                    args = json.loads(item.arguments)
                    # call the function
                    print("Function call:", item.name, json.loads(item.arguments))

                    result = await self.call_tool(name=name, args=args)

                    print(f"RESULT: {result}")
                    print(f"RESULT type: {type(result)}")
                    print()
                    print(f"NAME: {name}")
                    print(f"NAME_TYPE: {type(name)}")
                    print()
                    print(f"MESSAGES: {self.messages}")
                    self.messages.append(
                        {
                            "role": "function",
                            "name": name,
                            "content": json.dumps(result),
                        }
                    )
                    # result = await self.call_tool(item.name, item.arguments)
                    # print(f"RESULT: {result}")
                    self.call_model("")

        print(f"MESSAGES: {self.messages}")
