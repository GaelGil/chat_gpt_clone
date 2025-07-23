from Models.LLM import LLM


class ReviewAgent:
    def __init__(
        self,
        model: LLM,
        dev_prompt: str,
        messages: list = [],
    ):
        self.messages = messages
        self.model = model
        self.dev_promot = dev_prompt
        if self.dev_promot:
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
