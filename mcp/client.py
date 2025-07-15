from typing import Any, Dict
import nest_asyncio
from fastmcp import Client

# Apply nest_asyncio to allow nested event loops (needed for Jupyter/IPython)
nest_asyncio.apply()


class MCPClient:
    def __init__(self, base_url: str = "http://localhost:8050/sse"):
        self.base_url = base_url
        self.session = None

    async def connect(self):
        self.session = await Client(self.base_url).__aenter__()

    async def disconnect(self):
        if self.session:
            await self.session.__aexit__(None, None, None)
            self.session = None

    async def list_tools(self):
        if not self.session:
            raise RuntimeError("Session not connected")
        return await self.session.list_tools()

    async def call_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Any:
        if not self.session:
            raise RuntimeError("Session not connected")
        result = await self.session.call_tool(tool_name, arguments)
        return result.content[0].text if result.content else None


# async def main():
#     client = MCPClient()
#     await client.connect()
#     tools = await client.list_tools()
#     print("Available tools:", [tool.name for tool in tools])
#     await client.disconnect()


# if __name__ == "__main__":
#     asyncio.run(main())
