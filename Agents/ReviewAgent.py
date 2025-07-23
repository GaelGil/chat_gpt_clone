class ResponseAgent:
    def __init__(self, messages: list = []):
        self.messages = []

    def add_message(self, role: str, content: str):
        self.messages.append({"role": role, "content": content})

    def generate_response(self):
        pass
