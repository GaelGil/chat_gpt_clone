from Model import LLM


class Agent:
    def __init__(self, dev_prompt: str, max_turns: int = 1, tools: list = []):
        self.max_turns = max_turns
        self.llm = LLM(dev_prompt=dev_prompt)
        self.tools = tools

    def run(self, query: str):
        i = 0
        prompt = query
        while i < self.max_turns:
            i += 1
            result = self.llm(prompt)
            print(result)
            actions = result.output_parsed
            if actions:
                action, action_input = actions[0].groups()
            if action not in self.tools:
                return f"No known tool {action}"

            print()
            observation = self.tools()
