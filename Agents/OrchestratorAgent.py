class OrchestatorAgent:
    def __init__(self, dev_prompt, mcp_client, llm, messages, max_turns, tools):
        self.dev_prompt = dev_prompt
        self.mcp_client = mcp_client
        self.llm = llm
        self.max_turns = max_turns
        self.messages = messages
        self.tools = tools
        if self.dev_prompt:
            self.messages.append({"role": "developer", "content": self.dev_prompt})
