from dotenv import load_dotenv
from pathlib import Path
import asyncio
import os
from MCPClient import MCPClient
from Agent import Agent
import config

load_dotenv(Path("../../.env"))


async def execute():
    # start client
    client = MCPClient()
    # connect to client
    await client.connect()
    # get tools from client
    tools = await client.get_tools()
    agent = Agent(
        dev_prompt=config.dev_promopt,
        client=MCPClient,
        api_key=os.getenv("OPENAI_API_KEY"),
        model_name="gpt-4.1-mini",
        max_turns=1,
        tools=tools,
    )
    assert agent


if __name__ == "__main__":
    asyncio.run(execute())
