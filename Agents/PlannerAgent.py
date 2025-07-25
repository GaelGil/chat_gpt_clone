class OrchestatorAgent:
    def __init__(self, dev_prompt, client, api_key, model_name, max_turns, tools):
        self.dev_prompt = dev_prompt
        self.client = client
        self.llm = LLM(model_name=model_name, api_key=api_key)
        self.max_turns = max_turns
        self.tools = tools
