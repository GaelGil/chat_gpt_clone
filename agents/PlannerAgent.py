from openai import OpenAI
from models.schemas import PlanOutput


class PlannerAgent:
    def __init__(self, model: OpenAI, model_name: str, prompt: str, tools) -> None:
        """Initialize the BasAgent with a prompt and tools."""
        self.model = model
        self.model_name = model_name
        self.prompt = prompt
        self.tools = tools

    def run(self, input: str):
        response = self.model.responses.parse(
            model=self.model_name,
            input=[
                {
                    "role": "developer",
                    "content": "Given a topic, plan what is needed to write a draft to a essay and save to a txt file",
                },
                {"role": "user", "content": input},
            ],
            tools=self.tools,
            text_format=PlanOutput,
        )

        return response.output_parsed
