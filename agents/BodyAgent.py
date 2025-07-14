from agents.BaseAgent import BaseAgent


class BodyAgent(BaseAgent):
    def run(self, intro_text):
        prompt = f"Given this introduction:\n\n{intro_text}\n\nWrite the main body expanding on the topic."
        return self.model.generate(prompt)
