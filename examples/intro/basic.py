import os
from openai import OpenAI
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path("../.env"))

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# create a model response.
# we can provide some text or an image and will generate text and or json
# we can do input='text' or we can do
# input = [{role: role, content: content}]
# the api says to use developer over system
response = client.responses.create(
    model="gpt-4o",
    input=[
        {"role": "developer", "content": "You are a helpful AI assistant"},
        {
            "role": "user",
            "content": "Write a limerick about the Python programming language.",
        },
    ],
)

# select the output text
text_response = response.output[0].content[0].text
print(text_response)
