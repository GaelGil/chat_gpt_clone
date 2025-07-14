from agents.BaseAgent import BaseAgent


class ConclusionAgent(BaseAgent):
    def run(self, body_text):
        prompt = f"Based on this body:\n\n{body_text}\n\nWrite a thoughtful conclusion."
        return self.model.generate(prompt)
