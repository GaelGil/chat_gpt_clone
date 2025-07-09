from openai import OpenAI
from openai.types.chat.chat_completion import ChatCompletion

class Model:
    """
    """

    def __init__(self, client: OpenAI, prompt: dict={}, user_query: dict={}, tools: list={}, messages: list=[], model_name: str='LLaMa_CPP') -> None:
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
        self.prompt: dict = prompt 
        self.user_query: dict = user_query
        self.tools: dict = tools
        self.messages: list = messages

    def set_prompt(self, prompt: dict) -> None:
        """
        Function set the prompt for the llm to use

        Args: 
            prompt: A string containg the prompt for our llm

        Returns:
            None
        """
        self.prompt = prompt

    def set_user_query(self, user_query: dict) -> None:
        """
        Function set the users query

        Args: 
            query: A string containg the users query

        Returns:
            None
        """
        self.user_query = user_query

    def set_tools(self, tools: list) -> None:
        """
        Function set the tools available for the llm

        Args: 
            prompt: A dictionary of tools avaialble to the llm

        Returns:
            None
        """
        self.tools = tools

    def append_messages(self, options: dict) -> None:
        """
        Function to add custom message options for the llm

        Args: 
            options: A dictionary containing the options for the llm 

        Returns:
            None
        """
        self.messages.append(options)

    def set_messages(self) -> None:
        """
        Function to combine all the messages set

        Args: 
            None

        Returns:
            None
        """
        self.messages = [
            self.model_name,
            self.system_prompt,
            self.user_query,
            self.tools,
        ]

    def call_model(self) -> ChatCompletion:
        """
        Function call our llm model

        Args: 
            None

        Returns:
            ChatCompletion
        """
        completion = self.client.chat.completions.create(
            model=self.model_name,
            messages=self.messages,
            tools=self.tools,
            tool_choice='auto')
        return completion

