from openai import OpenAI
from models.schemas import ReviewedDocument


class ReviewAgent:
    def __init__(self, model: OpenAI, model_name: str, prompt: str, tools) -> None:
        """Initialize the ReviewAgent with a prompt and tools."""
        self.model = model
        self.model_name = model_name
        self.prompt = prompt
        self.tools = tools

    def run(self, full_text: str):
        response = self.model.responses.parse(
            model=self.model_name,
            input=[
                {
                    "role": "developer",
                    "content": "Review the following text and provide feedback.",
                },
                {"role": "user", "content": full_text},
            ],
            tools=self.tools,
            text_format=ReviewedDocument,
        )
        return response.output_parsed
