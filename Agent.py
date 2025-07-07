from llm.Model import Model
from openai.types.chat.chat_completion import ChatCompletion
import json


class Agent:
    def __init__(self, model: Model) -> None:
        """Function to initlize a agent instance
        Args:
            model: The llm model we are going to use

        Returns: 
            None
        """
        self.model = model
        self.working = False

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
        topic: str = input('Please the topic for the outline')
        self.model.set_user_query({
            "role": "user",
            "content": topic
            })

    def handle_response(self, response: ChatCompletion) -> None:
        message = response.choices[0].message
        if message.tool_calls:
            for tool_call in message.tool_calls:
                function_name = tool_call.function.name
                args = json.loads(tool_call.function.arguments)

                if function_name in self.model.tools: 
                    result = self.functions(function_name)
                else:
                    result = f"Unknown tool: {function_name}"

                self.model.append_messages({
                    "role": "assistant",
                    "tool_calls": [tool_call]
                })

                self.model.append_messages({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "name": function_name,
                    "content": result
                })
                
                
                new_response: ChatCompletion = self.call_model()

                return new_response                


    def start(self) -> None:
        """Function to start the agents tasks/process
        """
        self.set_working(True)
        self.get_input()
        self.set_messages()
        response: ChatCompletion = self.call_model()
        print(response)
        new_response = self.handle_response(response=response)
        print(new_response)
        self.set_working(False)

