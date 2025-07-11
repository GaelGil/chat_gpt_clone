import json
import os
import requests
from openai import OpenAI
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from pathlib import Path
load_dotenv(Path('../.env'))

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# a get weather function
def get_weather(latitude, longitude):
    response = requests.get(
        f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
    )
    data = response.json()
    return data['current']

# define tools
tools = [
    {
        'type': 'function',
            'name': 'get_weather',
            'description': 'Get current temperature for provided coordinates in celsius',
            'parameters': {
                'type': 'object',
                'properties': {
                    'latitude': {'type': 'number'},
                    'longitude': {'type': 'number'}
                },
                'required' : ['latitude', 'longitude'],
                'additionalProperties': False,
            },
            'strict': True
        
    }
]

# the input messages
messages = [
    {
        'role': 'developer',
        'content': 'You are a helpful weather assistant'
    },
    {
        'role': 'user',
        'content': 'Whats the weather line in paris today?'
    }
]

# define model response
response = client.responses.create(
    model='gpt-4o',
    input=messages,
    tools=tools
)

# get tool call
tool_call = response.output[0]
# some print statements
print(f'RESPONSE: {response}')
print(f'TOOL_CALL.TYPE: {tool_call.type}')
print(f'TOOL_CALL: {tool_call}')


# define function that the model can call
def call_function(name, args):
    if name == 'get_weather':
        return get_weather(**args)
    
for tool_call in response.output:
    if tool_call.type != 'function_call':
        continue
    name = tool_call.name
    args = json.loads(tool_call.arguments)
    messages.append(response.output[0])
    result = call_function(name, args)
    messages.append(
        {
            'type': 'function_call_output',
            'call_id': tool_call.call_id,
            'output': str(result)
        }
    )


class WeatherResponse(BaseModel):
    temperature: float = Field(
        description='The current temerature in celsius for the given location'
    )
    response: str = Field(
        description='A natural language response to the users question'
    )



response_two = client.responses.parse(
    model='gpt-4o',
    input=messages,
    tools=tools,
    text_format=WeatherResponse
)

final_response = response_two.output_parsed
print(final_response)
print(final_response.temperature)
print(final_response.response)