from agents.BaseAgent import BaseAgent


class IntroAgent(BaseAgent):
    def run(self, topic):
        prompt = f"Write a compelling introduction about: {topic}"
        return self.model.generate(prompt)
