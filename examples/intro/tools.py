import json
import asyncio
from schemas import WeatherResponse
from Model import LLM
from client import MCPClient


llm = LLM(model_name="gpt-4.1-mini")


def basic_tooling(llm: LLM, tools: list, client: MCPClient):
    # the input messages
    messages = [
        {"role": "developer", "content": "You are a helpful weather assistant"},
        {"role": "user", "content": "Whats the weather line in paris today?"},
    ]

    # define model response
    response = llm.create_response(messages=messages, tools=tools)

    # Get tool call.
    # At this point response.output[0] contains ResponseFunctionToolCall
    # The tool calls are in output[0] because the model is deciding what it returns.
    # In our case our model has decided to call a function to complete the task
    tool_call = response.output[0]
    # some print statements
    print(f"RESPONSE: {response} \n")
    print(f"TOOL_CALL.TYPE: {tool_call.type} \n")  # function_call
    print(f"TOOL_CALL: {tool_call} \n")
    print(f"MESSAGES BEFORE TOOL CALL: {messages} \n")

    # define function that the model can call
    async def call_function(name, args):
        if name == "get_weather":
            res = await client.call_tool(name, args)
            return res

    # for every tool call in the output
    for tool_call in response.output:
        if tool_call.type != "function_call":
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
                "type": "function_call_output",
                "call_id": tool_call.call_id,
                "output": str(result),
            }
        )

    print(f"MESSAGES AFTER TOOL CALL: {messages} \n")

    # get a response from model.
    response_two = llm.parse_response(
        messages=messages, tools=tools, response_format=WeatherResponse
    )

    # At this point response_two.output[0] contains the ParsedResponseOutputMessage
    # since the model has what it needs to complete its task it just returns the parsed output
    tool_call_two = response_two.output[0]
    # some print statements
    print(f"RESPONSE_TWO: {response_two} \n")
    print(f"TOOL_CALL_TWO.TYPE: {tool_call_two.type} \n")  # message
    print(f"TOOL_CALL_TWO: {tool_call_two} \n")  #
    print(f"MESSAGES AFTER RESPONSE_TWO: {messages} \n")

    final_response = response_two.output_parsed
    print(f"FINAL_RESPONSE: {final_response} \n")
    if final_response:
        print(f"FINAL_RESPONSE.TEMPERATURE: {final_response.temperature} \n")
        print(f"FINAL_RESPONSE.RESPONSE: {final_response.response} \n")


async def main():
    client = MCPClient()
    await client.connect()
    tools = await client.list_tools()
    llm = LLM(model_name="gpt-4.1-mini")

    basic_tooling(llm=llm, tools=tools, client=client)


if __name__ == "__main__":
    asyncio.run(main())
