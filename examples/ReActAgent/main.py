from dotenv import load_dotenv
from pathlib import Path
import asyncio

# from Types.schemas import PlanOutput, ResearchResponse
from MCPClient import MCPClient


load_dotenv(Path("./.env"))


async def execute():
    client = MCPClient()
    await client.connect()
    tools = await client.get_tools()
    print(tools)


if __name__ == "__main__":
    asyncio.run(execute())
