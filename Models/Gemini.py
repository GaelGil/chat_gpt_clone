from google import genai


class Gemini:
    """ """

    def __init__(self, model_name: str, api_key: str) -> None:
        """
        Args:
            None
        Returns:
            None
        """
        self.model_name = model_name
        # genai.configure(api_key=api_key)
        self.client = genai.Client()

    def create_response(self, messages: str, tools: list):
        """
        Create a response from the model based on the input messages and optional tools.
        """
        return self.client.chats.create(
            model="gemini-2.5-pro", history=messages, functions=tools
        )
