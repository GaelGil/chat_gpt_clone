from models.schemas import EssayIntroduction


class IntroAgent:
    def __init__(self, model, prompt: str, tools) -> None:
        """Initialize the IntroAgent with a prompt and tools."""
        self.model = model
        self.prompt = prompt
        self.tools = tools

    def send_messages(self, messages: list[dict]) -> str:
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
            text_format=EssayIntroduction,
        )
        return response.output_parsed
