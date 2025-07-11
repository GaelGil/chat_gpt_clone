import json
import os
from openai import OpenAI
from pydantic import BaseModel, Field

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# a function to search inside a json file
def search_kb(question: str):
    """
    Load the whole knowledge base from the JSON file.
    (This is a mock function for demonstration purposes, we don't search)
    """
    with open("kb.json", "r") as f:
        return json.load(f)
    
# define tools
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

# the system prompt (developer)
system_prompt = 'You are a helpful assistant that answers questions from the knowledge base about our e-commerce store'

# the inpiut messages
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

# create response 
response = client.responses.create(
    model='gpt-4.1-mini',
    input=messages,
    tools=tools
)

# the function that the model can call
def call_function(name, args):
    if name == 'search_kb':
        return search_kb(**args)

# for every tool call in the response
for tool_call in response.output:
    if tool_call.type != 'function_call':
        continue
    # select tool name
    name = tool_call.name
    # get the tool arguments
    args = json.loads(tool_call.arguments)
    # add the previous response output to input messages (tool_call = item in response.output)
    messages.append(tool_call)
    # call our function
    result = call_function(name, args)
    # add the result of that to our input messages
    messages.append(
        {
            'type': 'function_call_output',
            'call_id': tool_call.call_id,
            'output': str(result)
        }
    )

# class strucutre for our response
class KBResponse(BaseModel):
    answer: str = Field(description='The answer to the users question')
    source: int = Field(description='The record id of the answer')

# get a response and add our desired response format
response_two = client.responses.parse(
    model='gpt-4.1-mini',
    messages=messages,
    tools=tools,
    response_format=KBResponse
)

# print the final response
final_response = response_two.output_parsed
print(final_response)


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
