#!/usr/bin/env python3
from openai import OpenAI
import json

# Connect to local Llamafile server
client = OpenAI(
    base_url="http://localhost:8080/v1",  # Replace with your Llamafile API server
    api_key="sk-no-key-required"          # Llamafile doesn't require a real key
)

# Define available functions (tools)
functions = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the weather for a city.",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city to get weather for."
                    }
                },
                "required": ["location"]
            }
        }
    }
]

# Implement the tool (locally in Python)
def get_weather(location):
    return f"The weather in {location} is imaginary and probably nice."

# Build prompt
user_input = "What's the weather in Paris?"

messages = [
    {
        "role": "system",
        "content": "You are an AI assistant that can call tools to get things done."
    },
    {
        "role": "user",
        "content": user_input
    }
]

# Ask Llamafile to handle function calling
response = client.chat.completions.create(
    model="LLaMA_CPP",  # Or whatever name your Llamafile advertises
    messages=messages,
    tools=functions,
    tool_choice="auto"
)

message = response.choices[0].message

# Handle tool call if present
if message.tool_calls:
    for tool_call in message.tool_calls:
        fn_name = tool_call.function.name
        args = json.loads(tool_call.function.arguments)

        # Call the matching function
        if fn_name == "get_weather":
            result = get_weather(**args)
        else:
            result = f"Unknown tool: {fn_name}"

        # Add tool response
        messages.append({
            "role": "assistant",
            "tool_calls": [tool_call]
        })
        messages.append({
            "role": "tool",
            "tool_call_id": tool_call.id,
            "name": fn_name,
            "content": result
        })

        # Send final message to get AI to respond with results
        final_response = client.chat.completions.create(
            model="LLaMA_CPP",
            messages=messages
        )

        print(final_response.choices[0].message.content)
else:
    # No tool call, just regular response
    print(message.content)
