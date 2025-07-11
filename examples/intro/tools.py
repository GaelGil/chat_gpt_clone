import json
import os
import requests
from openai import OpenAI
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from pathlib import Path
load_dotenv(Path('../../.env'))

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
    model='gpt-4.1-mini',
    input=messages,
    tools=tools
)

# Get tool call. 
# At this point response.output[0] contains ResponseFunctionToolCall 
# The tool calls are in output[0] because the model is deciding what it returns.
# In our case our model has decided to call a function to complete the task
tool_call = response.output[0]
# some print statements
print(f'RESPONSE: {response} \n')
print(f'TOOL_CALL.TYPE: {tool_call.type} \n') # function_call
print(f'TOOL_CALL: {tool_call} \n')
print(f'MESSAGES BEFORE TOOL CALL: {messages} \n')

# define function that the model can call
def call_function(name, args):
    if name == 'get_weather':
        return get_weather(**args)

# for every tool call in the output
for tool_call in response.output:
    if tool_call.type != 'function_call':
        continue
    # select tool name
    name = tool_call.name
    # get the arguments for the tool
    args = json.loads(tool_call.arguments)
    # add the output to the messages (tool_call = item in response.output)
    messages.append(tool_call)
    # call the function
    result = call_function(name, args)
    print(response)
    # add the tool result to the messages
    messages.append(
        {
            'type': 'function_call_output',
            'call_id': tool_call.call_id,
            'output': str(result)
        }
    )


print(f'MESSAGES AFTER TOOL CALL: {messages} \n')

# create a class to get response in our desired structure
class WeatherResponse(BaseModel):
    temperature: float = Field(
        description='The current temerature in celsius for the given location'
    )
    response: str = Field(
        description='A natural language response to the users question'
    )

# get a response from model. 
response_two = client.responses.parse(
    model='gpt-4.1-mini',
    input=messages,
    tools=tools,
    text_format=WeatherResponse
)

# At this point response_two.output[0] contains the ParsedResponseOutputMessage
# since the model has what it needs to complete its task it just returns the parsed output
tool_call_two = response_two.output[0]
# some print statements
print(f'RESPONSE_TWO: {response_two} \n') 
print(f'TOOL_CALL_TWO.TYPE: {tool_call_two.type} \n') # message
print(f'TOOL_CALL_TWO: {tool_call_two} \n') # 
print(f'MESSAGES AFTER RESPONSE_TWO: {messages} \n')

final_response = response_two.output_parsed
print(f'FINAL_RESPONSE: {final_response} \n')
print(f'FINAL_RESPONSE.TEMPERATURE: {final_response.temperature} \n')
print(f'FINAL_RESPONSE.RESPONSE: {final_response.response} \n')