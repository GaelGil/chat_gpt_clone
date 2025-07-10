from openai import OpenAI

class ModelClient:
    """
    """

    def __init__(self, key: str) -> None:
        """
        Args:
            None
        Returns:
            None
        """
        self.client = OpenAI(api_key=key)

    def get_client(self) -> OpenAI:
        """Return the openai client
        Args: 
            None
        Returns:
            OpenAI
        """
        return self.client
