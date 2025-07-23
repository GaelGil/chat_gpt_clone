from Models.LLM import LLM


class OrchestratorAgent:
    def __init__(
        self,
        model: LLM,
        dev_prompt: str,
        messages: list = [],
    ):
        self.messages = messages
        self.model = model
        self.dev_prompt = dev_prompt
        if self.dev_prompt:
            self.add_message(role="developer", content=dev_prompt)

    def add_message(self, role: str, content: str):
        self.messages.append({"role": role, "content": content})

    def generate_response(self, response_format, parsed: bool = False):
        if parsed:
            response = self.model.parse_response(
                messages=self.messages, response_format=response_format
            )

            return response.parsed

        response = self.model.parse_response(messages=self.messages)

        return response

    def run(self, agents, essay_topic, max_iter: int = 3):
        # Initial prompt from developer
        self.add_message("user", f"Write an essay about: {essay_topic}")
        self.add_message(
            "assistant", "I will coordinate with other agents to complete this task."
        )

        researcher = next(agent for agent in agents if agent.name == "researcher")
        responder = next(agent for agent in agents if agent.name == "responder")
        reviewer = next(agent for agent in agents if agent.name == "reviewer")
        section = next(agent for agent in agents if agent.name == "section")

        for i in range(max_iter):
            # Step 1: Research relevant content
            self.add_message("user", f"Research the topic: {essay_topic}")
            research_notes = researcher.run(essay_topic)
            self.add_message("function", "researcher", str(research_notes))

            # Step 2: Create rough essay response
            self.add_message(
                "user", f"Use the following notes to create a draft: {research_notes}"
            )
            rough_draft = responder.run(research_notes)
            self.add_message("function", "responder", str(rough_draft))

            # Step 3: Review the draft
            self.add_message(
                "user", f"Review the draft for quality and coherence: {rough_draft}"
            )
            review_feedback = reviewer.run(rough_draft)
            self.add_message("function", "reviewer", str(review_feedback))

            # Step 4: Improve based on feedback
            self.add_message(
                "user", f"Revise the essay with this feedback: {review_feedback}"
            )
            revised_draft = section.run(rough_draft, review_feedback)
            self.add_message("function", "section", str(revised_draft))

            # Final check or return early if good enough
            if "final" in review_feedback.lower() or i == max_iter - 1:
                print("Final Essay:", revised_draft)
                return revised_draft
