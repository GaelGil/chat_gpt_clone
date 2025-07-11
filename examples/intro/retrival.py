import json
import os
from openai import OpenAI
from pydantic import BaseModel, Field

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def search_kb(question: str):
    """
    Load the whole knowledge base from the JSON file.
    (This is a mock function for demonstration purposes, we don't search)
    """
    with open("kb.json", "r") as f:
        return json.load(f)
    
tools = [
    {
        'type': 'function',
        'name': 'search_kb',
        'description': 'Get the answer to the users question from the knowledge base',
        'parameters': {
            'type': 'object',
            'properties': {
                'question': {'type': 'string'}
            },
            'required': ['question'],
            'additionalProperties': False,
        },
        'strict': True       
    }
]

system_prompt = 'You are a helpful assistant that answers questions from the knowledge base about our e-commerce store'

messages = [
    {
        'role': 'developer',
        'content': system_prompt
    },
    {
        'rolse': 'user',
        'content': 'what is the return policy?'
    }
]

response = client.responses.create(
    model='gpt-4.1-mini',
    input=messages,
    tools=tools
)



def call_function(name, args):
    if name == 'search_kb':
        return search_kb(**args)
    
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


class KBResponse(BaseModel):
    answer: str = Field(description='The answer to the users question')
    source: int = Field(description='The record id of the answer')

response_two = client.responses.parse(
    model='gpt-4.1-mini',
    messages=messages,
    tools=tools,
    response_format=KBResponse
)

final_response = response_two.output_parsed
final_response.answer
final_response.source


# this wont cause a function call
messages = [
    {"role": "system", "content": system_prompt},
    {"role": "user", "content": "What is the weather in Tokyo?"},
]

response_three = client.responses.parse(
    model="gpt-4.1-mini",
    messages=messages,
    tools=tools,
)

print(response_three)
