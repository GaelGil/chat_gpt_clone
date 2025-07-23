from Models.LLM import LLM


class ResearchAgent:
    def __init__(
        self,
        model: LLM,
        dev_prompt: str,
        tools: list,
        messages: list = [],
    ):
        self.messages = messages
        self.model = model
        self.dev_prompt = dev_prompt
        self.tools = tools
        if self.dev_prompt:
            self.add_message(role="developer", content=dev_prompt)

    def add_message(self, role: str, content: str):
        self.messages.append({"role": role, "content": content})

    def generate_response(self, response_format, tools: list, parsed: bool = False):
        if parsed:
            response = self.model.parse_response(
                messages=self.messages,
                response_format=response_format,
                tools=self.tools,
            )

            return response.parsed

        response = self.model.parse_response(messages=self.messages, tools=self.tools)

        return response
