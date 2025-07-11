from openai import OpenAI
from openai.types.chat.chat_completion import ChatCompletion

class Model:
    """
    """

    def __init__(self, client: OpenAI, model_name: str, input_messages: list=[], tool_defs: list={}) -> None:
        """ Function to initiliaze a llm model
        Args: 
            client: The client instance of our model
            model_name: The name of the model we are using
            system_prompt: The prompt we are setting for our model
            user_query: The prompt by the user
            tools: The tools available to the llm.
            messages: The messages for the llm model.

        Returns:
            None
        """
        self.client = client
        self.model_name: str = model_name
        self.input_messages: list = input_messages
        self.tool_defs: dict = tool_defs

    def set_tool_defs(self, tool_defs: list) -> None:
        """
        Function set the tools available for the llm

        Args: 
            prompt: A dictionary of tools avaialble to the llm

        Returns:
            None
        """
        self.tool_defs = tool_defs

    def append_messages(self, messages: dict) -> None:
        """
        Function to add custom message options for the llm

        Args: 
            options: A dictionary containing the options for the llm 

        Returns:
            None
        """
        self.input_messages.append(messages)

    def call_model(self) -> ChatCompletion:
        """
        Function call our llm model

        Args: 
            None

        Returns:
            ChatCompletion
        """
        response = self.client.responses.create(
            model=self.model_name,
            messages=self.input_messages,
            tools=self.tool_defs,
            tool_choice='auto')
        return response

