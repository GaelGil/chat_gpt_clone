# from models import schemas
import os
from Model.LLM import LLM
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path("./.env"))

if __name__ == "__main__":
    # Initialize the LLM with a model name and API key

    llm = LLM(model_name="gpt-4.1-mini", api_key=os.getenv("OPENAI_API_KEY"))

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
