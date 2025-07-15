from models.schemas import EssayIntroduction


class IntroAgent:
    def __init__(self, model, prompt: str, tools) -> None:
        """Initialize the IntroAgent with a prompt and tools."""
        self.model = model
        self.prompt = prompt
        self.tools = tools

    def send_messages(self, messages: List[dict]) -> str:
        """Send messages to the model and return the response."""
        return self.model.generate(messages)
