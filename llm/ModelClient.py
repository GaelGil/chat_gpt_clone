from openai import OpenAI

class ModelClient:
    """
    """

    def __init__(self, key: str) -> None:
        """
        """
        self.client = OpenAI(api_key=key)

    def get_client(self) -> OpenAI:
        """
        """
        return self.client
