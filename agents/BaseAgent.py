from typing import Any, Dict, Optional
from mcp.client import MCPClient  # Adjust this import based on your project structure


class BaseAgent:
    def __init__(self, client: Optional[MCPClient] = None):
        self.client = client or MCPClient()
        self.session = None

    async def start(self):
        """Connect to MCP server."""
        await self.client.connect()
        self.session = self.client.session
        print("🤖 BaseAgent connected to MCP server.")

    async def stop(self):
        """Disconnect from MCP server."""
        await self.client.disconnect()
        print("🛑 BaseAgent disconnected.")

    async def list_available_tools(self) -> list:
        """List all tools from the server."""
        tools = await self.client.list_tools()
        print("🧰 Available tools:", [t.name for t in tools])
        return tools

    async def use_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Any:
        """Call a tool by name with arguments."""
        print(f"🛠 Using tool `{tool_name}` with arguments: {arguments}")
        result = await self.client.call_tool(tool_name, arguments)
        print(f"✅ Tool `{tool_name}` result: {result}")
        return result

    async def run(self, *args, **kwargs):
        """
        Override this method in subclasses to define agent behavior.
        """
        raise NotImplementedError("Subclasses must implement the `run()` method.")
