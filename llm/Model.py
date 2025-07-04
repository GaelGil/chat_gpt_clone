from openai import OpenAI
from openai.types.chat.chat_completion import ChatCompletion

class Model:
    """
    """

    def __init__(self, client: OpenAI, model_name: str='LLaMa_CPP') -> None:
        """ Function to initiliaze a llm model
        Args: 
            client: The client instance of our model
            model_name: The name of the model we are using
            prompt: The prompt we are setting for our model
        Returns:
            None
        """
        self.client = client
        self.model_name = model_name
        self.prompt: dict = {"role": "system"}

    def set_prompt(self, prompt: str) -> None:
        """
        Function set the prompt for the llm to use

        Args: 
            prompt: A string containg the prompt for our llm

        Returns:
            None
        """
        self.prompt['content'] = prompt
            

    def query(self, user_query: str) -> ChatCompletion:
        """
        Function send a query to a llm

        Args: 
            user_query: the query that the user has inputed

        Returns:
            ChatCompletion
        """
        messages: list[dict] = [
            self.prompt, 
                {
                'role': 'uesr',
                'content': user_query
                }]
        
        completion = self.client.chat.completions.create(model=self.model_name, messages=messages)
        return completion

