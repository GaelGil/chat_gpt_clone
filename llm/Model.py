from openai import OpenAI
from openai.types.chat.chat_completion import ChatCompletion

class Model:
    """
    """

    def __init__(self, client: OpenAI, system_prompt: dict={}, user_query: dict={}, tools: list=[], model_name: str='LLaMa_CPP') -> None:
        """ Function to initiliaze a llm model
        Args: 
            client: The client instance of our model
            model_name: The name of the model we are using
            prompt: The prompt we are setting for our model
        Returns:
            None
        """
        self.client = client
        self.model_name: str = model_name
        self.system_prompt: dict = system_prompt 
        self.user_query: dict = user_query
        self.tools: list = tools

    def set_system_prompt(self, system_prompt: dict) -> None:
        """
        Function set the prompt for the llm to use

        Args: 
            prompt: A string containg the prompt for our llm

        Returns:
            None
        """
        self.system_prompt = system_prompt

    def set_user_query(self, user_query: dict) -> None:
        """
        Function set the prompt for the llm to use

        Args: 
            prompt: A string containg the prompt for our llm

        Returns:
            None
        """
        self.user_query = user_query

    def set_tools(self, tools: list) -> None:
        """
        """
        self.tools = tools

    def call_model(self) -> ChatCompletion:
        """
        Function send a query to a llm

        Args: 
            None

        Returns:
            ChatCompletion
        """
        completion = self.client.chat.completions.create(
            model=self.model_name,
            messages=[
                self.system_prompt,
                self.user_query
            ],
            tools=self.tools,
            tool_choice='auto')
        return completion

