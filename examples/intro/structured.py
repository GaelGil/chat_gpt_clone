import os
from openai import OpenAI
from pydantic import BaseModel
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path("../../.env"))

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# we can create a class like this to give to the model
# it can then return the output in the structure of our class
class CalendarEvent(BaseModel):
    name: str
    date: str
    participants: list[str]


response = client.responses.parse(
    model="gpt-4o",
    input=[
        {"role": "system", "content": "Extract envet information"},
        {
            "role": "user",
            "content": "Alice and Bob are going to a science fair on friday",
        },
    ],
    text_format=CalendarEvent,
)

# get the parsed output in the format specified
event = response.output_parsed
# print event
print(event)
