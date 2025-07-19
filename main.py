import os
from Models.OpenAi import OpenAi

# from Models.Gemini import Gemini
import json
from dotenv import load_dotenv
from pathlib import Path
import asyncio

# from Types.schemas import PlanOutput, ResearchResponse
from MCP.client import MCPClient
from Prompts.Agent import AGENT_PROMPT
import aioconsole  # Import aioconsole


load_dotenv(Path("./.env"))


async def execute():
    client = MCPClient()
    await client.connect()
    tools = await client.get_tools()
    llm = OpenAi(model_name="gpt-4.1-mini", api_key=os.getenv("OPENAI_API_KEY"))
    # llm = Gemini(model_name="gemini-2.5-pro", api_key=os.getenv("OPENAI_API_KEY"))

    while True:
        query = await aioconsole.ainput("\nYour question (or type 'exit'): ")
        query = query.strip()
        if query.lower() in ("exit", "quit"):
            await client.aclose()
            print("Session done")
            break

        messages = [
            {
                "role": "developer",
                "content": AGENT_PROMPT,
            },
            {
                "role": "user",
                "content": query,
            },
        ]

        # while True:
        response = llm.create_response(messages=messages, tools=tools)
        print(response)
        # if not response.output or response.output[0].type != "function_call":
        #     print("⚠️ Unexpected response:", response)
        #     break

        # call = response.output[0]
        # messages.append(call)
        # args = json.loads(call.arguments)
        # result = await client.call_tool(call.name, args)

        # messages.append(
        #     {
        #         "type": "function_call_output",
        #         "call_id": call.call_id,
        #         "output": result,
        #     }
        # )

        # if call.name == "finalize_and_save":
        #     print(" Essay complete.")
        #     break

        # # loop back for a new topic

        # await client.aclose()


if __name__ == "__main__":
    asyncio.run(execute())
