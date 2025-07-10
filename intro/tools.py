import json
import os
import requests
from openai import OpenAI
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from pathlib import Path
load_dotenv(Path('../.env'))

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def get_weather(latitude, longitude):
    response = requests.get(
        f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
    )
    data = response.json()
    return data['current']


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

response = client.responses.create(
    model='gpt-4o',
    input=messages,
    tools=tools
)

tool_call = response.output[0]
print(f'RESPONSE: {response}')
print(f'TOOL_CALL.TYPE: {tool_call.type}')
print(f'TOOL_CALL: {tool_call}')

# response.model_dump()

# def call_function(name, args):
#     if name == 'get_weather':
#         return get_weather(**args)
    
# for tool_call in response.output:
#     if tool_call.type != 'function_call':
#     name = tool_call.function.name
#     args = json.loads(tool_call.function.arguments)
#     messages.append(completion.choices[0].message)

#     result = call_function(name, args)
#     messages.append(
#         {
#             'role': 'tool',
#             'tool_call_id': tool_call.id,
#             'content': json.dumps(result)
#         }
#     )


class WeatherResponse(BaseModel):
    temperature: float = Field(
        description='The current temerature in celsius for the given location'
    )
    response: str = Field(
        description='A natural language response to the users question'
    )



completion_two = client.beta.chat.completions.parse(
    model='gpt-4o',
    messages=messages,
    tools=tools,
    response_format=WeatherResponse
)

final_response = completion_two.choices[0].message.parsed
final_response.temperature
final_response.response