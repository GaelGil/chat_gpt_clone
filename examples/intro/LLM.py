import os
from openai import OpenAI
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path("../../.env"))


class LLM:
    def __init__(self, model_name: str) -> None:
        self.model_name = model_name
        # print(os.getenv("OPENAI_API_KEY"))
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def create_response(
        self,
        messages: list,
        tools: list = None,
        tool_choice: str = "auto",
    ) -> OpenAI.responses:
        """
        Create a response from the model based on the input messages and optional tools.
        """
        return self.client.responses.create(
            model=self.model_name,
            input=messages,
            tools=tools,
            tool_choice=tool_choice,
        )

    def parse_response(
        self,
        messages: list,
        tools: list = None,
        tool_choice: str = "auto",
        response_format="text",
    ) -> OpenAI.responses:
        """
        Parse the response from the model based on the input messages, optional tools, and desired response format.
        """
        return self.client.responses.parse(
            model=self.model_name,
            input=messages,
            tools=tools,
            tool_choice=tool_choice,
            text_format=response_format,
        )
