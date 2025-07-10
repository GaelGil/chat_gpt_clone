import os
import re
import json
from openai import OpenAI
from pydantic import BaseModel, ValidationError

def extract_json(text: str) -> str:
    # Remove markdown code fences if present
    codeblock_match = re.search(r"```json\s*(\{.*?\})\s*```", text, re.DOTALL)
    if codeblock_match:
        return codeblock_match.group(1)

    # If no fenced code block, try to find JSON object with braces
    brace_match = re.search(r"(\{.*\})", text, re.DOTALL)
    if brace_match:
        return brace_match.group(1)

    # Fallback: return original text
    return text


# Connect to Llamafile's OpenAI-compatible local server
client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key="sk-no-key-required"
)

# Define expected output structure
class CalendarEvent(BaseModel):
    name: str
    date: str
    participants: list[str]

# Prompt the model to respond in JSON format
response = client.chat.completions.create(
    model="LLaMA_CPP",  # or whatever model name Llamafile reports
    messages=[
        {"role": "system", "content": "Extract the event information and respond ONLY in JSON with keys: name, date, and participants (a list)."},
        {"role": "user", "content": "Alice and Bob are going to a science fair on Friday."}
    ]
)

# Get the raw content string
content = response.choices[0].message.content.strip()

print("[🧠] Raw model response:")
print(content)
json_str = extract_json(content)
# Try parsing the JSON manually
try:
    data = json.loads(json_str)
    event = CalendarEvent(**data)
    print("\n[✅] Parsed CalendarEvent:")
    print(f"Name: {event.name}")
    print(f"Date: {event.date}")
    print(f"Participants: {', '.join(event.participants)}")
except (json.JSONDecodeError, ValidationError) as e:
    print(f"[❌] Failed to parse response as CalendarEvent:\n{e}")
