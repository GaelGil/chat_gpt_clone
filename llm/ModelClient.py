from openai import OpenAI

class ModelClient:
    """
    """

    def __init__(self, url: str, key: str):
        self.client = OpenAI(base_url=url, api_key=key)
        pass


    def get_client(self) -> OpenAI:
        return self.client
