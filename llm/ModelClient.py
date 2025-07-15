from openai import OpenAI


class ModelClient:
    """ """

    def __init__(self, api_key: str) -> None:
        """
        Args:
            None
        Returns:
            None
        """
        self.client = OpenAI(api_key=api_key)

    def get_client(self) -> OpenAI:
        """Return the openai client
        Args:
            None
        Returns:
            OpenAI
        """
        return self.client
