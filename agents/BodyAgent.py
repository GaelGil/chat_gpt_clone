class BodyAgent:
    def __init__(self, model, prompt: str, tools) -> None:
        """Initialize the BasAgent with a prompt and tools."""
        self.model = model
        self.prompt = prompt
        self.tools = tools

    def run(self, intro_text):
        prompt = f"Given this introduction:\n\n{intro_text}\n\nWrite the main body expanding on the topic."
        return self.model.generate(prompt)
