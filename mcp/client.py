import asyncio
import json
from contextlib import AsyncExitStack
from typing import Any, Dict, List
import os

import nest_asyncio
from dotenv import load_dotenv
from fastmcp import Client
from openai import AsyncOpenAI

# Apply nest_asyncio to allow nested event loops (needed for Jupyter/IPython)
nest_asyncio.apply()

# Load environment variables
load_dotenv("../.env")

# Global variables to store session state
session = None
exit_stack = AsyncExitStack()
openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
model = "gpt-4.1-mini"
stdio = None
write = None


async def connect_to_server(base_url: str = "http://localhost:8600/sse"):
    """Connect to an MCP server via HTTP + SSE."""
    global session, exit_stack

    # Open HTTP SSE connection via Client
    session = await exit_stack.enter_async_context(Client(base_url))

    # Initialize the session
    await session.initialize()

    # List available tools
    tools_result = await session.list_tools()
    print("\n✅ Connected to server with tools:")
    for tool in tools_result.tools:
        print(f"  - {tool.name}: {tool.description}")


async def get_mcp_tools(session) -> List[Dict[str, Any]]:
    """Get available tools from the MCP server in OpenAI format.

    Returns:
        A list of tools in OpenAI format.
    """
    # global session

    tools_result = await session.list_tools()
    return [
        {
            "type": "function",
            "function": {
                "name": tool.name,
                "description": tool.description,
                "parameters": tool.inputSchema,
            },
        }
        for tool in tools_result
    ]


async def process_query(session, query: str) -> str:
    """Process a query using OpenAI and available MCP tools.

    Args:
        query: The user query.

    Returns:
        The response from OpenAI.
    """
    global openai_client, model

    # Get available tools
    tools = await get_mcp_tools(session)

    # Initial OpenAI API call
    response = await openai_client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": query}],
        tools=tools,
        tool_choice="auto",
    )

    # Get assistant's response
    assistant_message = response.choices[0].message

    # Initialize conversation with user query and assistant response
    messages = [
        {"role": "user", "content": query},
        assistant_message,
    ]

    # Handle tool calls if present
    if assistant_message.tool_calls:
        # Process each tool call
        for tool_call in assistant_message.tool_calls:
            # Execute tool call
            result = await session.call_tool(
                tool_call.function.name,
                arguments=json.loads(tool_call.function.arguments),
            )

            # Add tool response to conversation
            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": result.content[0].text,
                }
            )

        # Get final response from OpenAI with tool results
        final_response = await openai_client.chat.completions.create(
            model=model,
            messages=messages,
            tools=tools,
            tool_choice="none",  # Don't allow more tool calls
        )

        return final_response.choices[0].message.content

    # No tool calls, just return the direct response
    return assistant_message.content


async def cleanup():
    """Clean up resources."""
    global exit_stack
    await exit_stack.aclose()


async def main():
    """Main entry point for the client using SSE + OpenAI tools."""
    async with Client("http://0.0.0.0:8050/sse") as session:
        # Get available tools from MCP
        tools = await session.list_tools()
        print(f"TOOLS: {tools}")
        print("🛠 Tools:", [t.name for t in tools])

        # Example user query
        query = "What is our company's vacation policy?"
        print(f"\n❓ Query: {query}")

        response = await process_query(session, query)
        print(f"\nResponse: {response}")

    await cleanup()


asyncio.run(main())


if __name__ == "__main__":
    asyncio.run(main())
