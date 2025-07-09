from llm.Model import Model
from openai.types.chat.chat_completion import ChatCompletion
import json
import re


class Agent:
    def __init__(self, model: Model, functions: dict) -> None:
        """Function to initlize a agent instance
        Args:
            model: The llm model we are going to use

        Returns: 
            None
        """
        self.model: Model = model
        self.working: bool = False
        self.functions: dict = functions

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
        print("IN HANDLE MESSAGE")
        content = message.content
        pattern = r"```json\s*(\{.*?\})\s*```"
        match = re.search(pattern, content, re.DOTALL)
        if match:
            print("IN MATCH")
            tool_call_json = json.loads(match.group(1))
            tool_name = tool_call_json.get('action') 
            tool_name = tool_name.replace("Tool.", "")
            tool_args = {
                'query': tool_call_json.get('content')  # adjust if your tool expects different param names
            }
            print(f'TOOL NAME: {tool_name}')
            tool = self.functions[tool_name]
            sample = tool(query='what is grok')
            print(f'SAMPLE: {sample}')
            print(f'Functions in AGENT.py: {self.functions}')
            print(f'TOOL: {tool}')
            try:


                # Call the tool function manually
                if tool_name in self.model.tools:
                    result = tool(**tool_args)
                    print("CORRECT TOOLS")
                else:
                    print('ELSE')
                    result = f"Unknown tool: {tool_name}"
                print(f'RESULT {result}')

                # Append the tool result back as messages for model context
                self.model.append_messages({
                    "role": "assistant",
                    "content": content
                })
                self.model.append_messages({
                    "role": "tool",
                    "name": tool_name,
                    "content": result
                })
                    
                return self.call_model()

            except Exception as e:
                print("Failed to parse or handle embedded tool call:", e)
                    

            return self.call_model()

        return response

    def start(self) -> None:
        """Function to start the agents tasks/process
        """
        self.set_working(True)
        self.get_input()
        self.model.set_messages()
        response: ChatCompletion = self.call_model()
        while True:
            print("🧠 Assistant:\n", response.choices[0].message.content)

            # Handle potential tool calls and return the next response
            next_response = self.handle_response(response)

            # If no tool was invoked or nothing more to do, we're done
            if next_response == response:
                break

            # Otherwise, continue the loop with the new response
            response = next_response

        self.set_working(False)
