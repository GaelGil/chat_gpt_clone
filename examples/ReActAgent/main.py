from dotenv import load_dotenv
from pathlib import Path
import asyncio

# from Types.schemas import PlanOutput, ResearchResponse
from MCPClient import MCPClient


load_dotenv(Path("./.env"))


async def execute():
    # start client
    client = MCPClient()
    # connect to client
    await client.connect()
    # get tools from client
    tools = await client.get_tools()


if __name__ == "__main__":
    asyncio.run(execute())
