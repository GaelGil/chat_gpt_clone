from google import genai
from google.genai.types import GenerateContentConfig


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
        genai.configure(api_key=api_key)
        self.client = genai.Client()

    def create_response(self, prompt: str, config: GenerateContentConfig = None):
        """
        Create a response from the model based on the input messages and optional tools.
        """
        return self.client.responses.create(
            model=self.model_name, contents=prompt, config=config
        )
