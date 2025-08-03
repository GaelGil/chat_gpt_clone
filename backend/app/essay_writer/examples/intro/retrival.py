import json
from .LLM import LLM
from client import MCPClient
from Schemas import KBResponse
import asyncio


async def basic_retrival(llm: LLM, tools: list, client: MCPClient):
    # the system prompt (developer)
    system_prompt = "You are a helpful assistant that answers questions from the knowledge base about our e-commerce store"

    # the inpiut messages
    messages = [
        {"role": "developer", "content": system_prompt},
        {"role": "user", "content": "what is the return policy?"},
    ]

    # create response
    response = llm.create_response(messages=messages, tools=tools)

    # the function that the model can call
    async def call_function(name, args):
        if name == "search_kb":
            res = await client.call_tool(name, args)
            return res

    print(f"RESPONSE: {response}")
    print(
        f"RESPONSE.output: {response.output}"
    )  #  [ResponseFunctionToolCall(arguments='{}', call_id='call_NodbSVSERRz8lPNTFPWnuDDL', name='search_kb', type='function_call', id='fc_687c197153e881a0980c9358a1857dfb03ede6fce18bc1bb', status='completed')]

    # for every tool call in the response
    for tool_call in response.output:
        if tool_call.type != "function_call":
            continue
        # select tool name
        name = tool_call.name
        # get the tool arguments
        args = json.loads(tool_call.arguments)
        # add the previous response output to input messages (tool_call = item in response.output)
        messages.append(tool_call)
        # call our function
        result = await call_function(name, args)
        # add the result of that to our input messages
        messages.append(
            {
                "type": "function_call_output",
                "call_id": tool_call.call_id,
                "output": str(result),
            }
        )

    # get a response and add our desired response format
    response_two = llm.parse_response(
        messages=messages, tools=tools, response_format=KBResponse
    )

    # print the final response
    final_response = response_two.output_parsed
    print(final_response)

    # this wont cause a function call because the model does not have information/tool on how to answer
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": "What is the weather in Tokyo?"},
    ]

    response_three = llm.parse_response(
        messages=messages, tools=tools, response_format=KBResponse
    )

    print(response_three)


async def main():
    client = MCPClient()
    await client.connect()
    tools = await client.get_tools()
    llm = LLM(model_name="gpt-4.1-mini")

    await basic_retrival(llm=llm, tools=tools, client=client)


if __name__ == "__main__":
    asyncio.run(main())
