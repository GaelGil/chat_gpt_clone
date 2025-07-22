from openai import OpenAI


class LLM:
    """LLM class function"""

    def __init__(self, model_name: str, api_key: str) -> None:
        """
        Args:
            None
        Returns:
            None
        """
        self.client: OpenAI = OpenAI(api_key=api_key)
        self.model_name: str = model_name

    def create_response(self, messages: dict, tools: list = []) -> OpenAI.responses:
        """
        Create a response from the model based on the input messages and optional tools.
        """
        return self.client.responses.create(
            model=self.model_name,
            input=messages,
            tools=tools,
            tool_choice="auto",
        )

    def parse_response(
        self,
        messages: list,
        response_format,
        tools: list = [],
    ) -> OpenAI.responses:
        """
        Parse the response from the model based on the input messages, optional tools, and desired response format.
        """
        return self.client.responses.parse(
            model=self.model_name,
            input=messages,
            tools=tools,
            tool_choice="auto",
            text_format=response_format,
        )
