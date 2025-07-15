import os
from Model.LLM import LLM
from dotenv import load_dotenv
from pathlib import Path
from mcp.client import MCPClient


load_dotenv(Path("./.env"))


async def run_agent():
    client = MCPClient()
    await client.connect()
    tools = await client.get_tools()
    llm = LLM(model_name="gpt-4.1-mini", api_key=os.getenv("OPENAI_API_KEY"))
    response = llm.create_response(
        messages=[
            {
                "role": "developer",
                "content": """
                You are a helpful AI assistant that can write essays, poems, and other creative content. You have access to tools and can use them to assist you in creating content for the essay or poem.
                You can also use the tools to search for information, generate images, and more. Use the tools when necessary to provide the best response. You should plan each part of the essay before writing it.
                For example essays have a certain structure, so you should plan the introduction, body, and conclusion before writing the essay.""",
            },
            {
                "role": "user",
                "content": "Write a thoughtful essay about the cultural impact of star wars. The essay should be at least 500 words long and include references to the original trilogy, the prequels, and the sequels. Include the sources",
            },
        ],
        tools=tools,
    )

    steps


if __name__ == "__main__":
    run_agent()  # Run the agent function
    # Initialize the LLM with a model name and API key

    # Example usage of create_response
    # response = llm.create_response(
    #     messages=[
    #         {"role": "developer", "content": "You are a helpful AI assistant"},
    #         {
    #             "role": "user",
    #             "content": "Write a limerick about the Python programming language.",
    #         },
    #     ]
    # )

    # # Print the text response
    # text_response = response.output[0].content[0].text
    # print(text_response)
