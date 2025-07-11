from llm.Model import Model
from openai.types.chat.chat_completion import ChatCompletion
import json
import re


class Agent:
    def __init__(self, model: Model, tools: dict) -> None:
        """Function to initlize a agent instance
        Args:
            model: The llm model we are going to use

        Returns: 
            None
        """
        self.model: Model = model
        self.working: bool = False
        self.tools: dict = tools

    def set_working(self, working: bool) -> None:
        """Function to set the value of working or not working
        Args: 
            working: a true or false value

        Returns:
            None
        """
        self.working = working

    def parse_response(self, response: ChatCompletion) -> None:
        pass

    def call_model(self) -> ChatCompletion:
        return self.model.call_model()

    def get_input(self) -> None:
        """
        """
        topic: str = input('Please the topic for the outline: ')
        self.model.set_user_query({
            "role": "user",
            "content": topic
            })

    def handle_response(self, response: ChatCompletion) -> ChatCompletion:
        message = response.choices[0].message
        if message.tool_calls:
            for tool_call in message.tool_calls:
                fn_name = tool_call.function.name
                args = json.loads(tool_call.function.arguments)

                if fn_name in self.functions:
                    func = self.functions[fn_name]
                    result = func(**args)
                else:
                    result = f"Unknown tool: {fn_name}"

                # Add tool response
                self.model.messages.append({
                    "role": "assistant",
                    "tool_calls": [tool_call]
                })
                self.model.messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "name": fn_name,
                    "content": result
                })

                print(self.model.messages)
                response = self.call_model()
                return response
    
        return response

    def start(self) -> None:
        """Function to start the agents tasks/process
        """
        self.set_working(True)
        self.get_input()
        self.model.set_messages()
        response: ChatCompletion = self.call_model()
        while True:
            print('Assistant:\n', response.choices[0].message.content)
            print(response)

            # Handle potential tool calls and return the next response
            next_response = self.handle_response(response)

            # If no tool was invoked or nothing more to do, we're done
            if next_response == response:
                break

            # Otherwise, continue the loop with the new response
            response = next_response

        self.set_working(False)
