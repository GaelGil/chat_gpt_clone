from tools.wikipedia_tool import WikipediaTool


class ToolRegistry:
    def __init__(self):
        self.tools = {"wikipedia_search": WikipediaTool()}

    def get_tool_names(self):
        return list(self.tools.keys())

    def call_tool(self, name: str, input: str) -> str:
        if name in self.tools:
            return self.tools[name].call(input)
        else:
            return f"No such tool: {name}"
