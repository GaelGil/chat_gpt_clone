from agents.BaseAgent import BaseAgent


class ReviewAgent(BaseAgent):
    def run(self, full_text):
        prompt = f"Review and edit the following text for clarity, grammar, and coherence:\n\n{full_text}"
        return self.model.generate(prompt)
