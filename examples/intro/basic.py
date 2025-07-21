from LLM import LLM

model = LLM(model_name="gpt-4.1-mini")


# create a model response.
# we can provide some text or an image and will generate text and or json
# we can do input='text' or we can do
# input = [{role: role, content: content}]
# the api says to use developer over system

response = model.create_response(
    messages=[
        {"role": "developer", "content": "You are a helpful AI assistant"},
        {
            "role": "user",
            "content": "Write a limerick about the Python programming language.",
        },
    ]
)

# select the output text
text_response = response.output_text
print(f"TEXT_RESPONSE: {text_response}")
print(f"RESPONSE: {response}")

"""
TEXT_RESPONSE: In Python, the code’s clean and bright,
With syntax that's simple and tight.
Indentation’s the key,
Makes bugs easy to see,
And programs just flow with delight!
RESPONSE: Response(id='resp_687c18f05e1081a1a768ae70d8fb00c3038be285c6a9eedb', created_at=1752963312.0, error=None, incomplete_details=None, instructions=None, metadata={}, model='gpt-4.1-mini-2025-04-14', object='response', output=[ResponseOutputMessage(id='msg_687c18f0afcc81a19966dd8f4e7ad55f038be285c6a9eedb', content=[ResponseOutputText(annotations=[], text="In Python, the code’s clean and bright,  \nWith syntax that's simple and tight.  \nIndentation’s the key,  \nMakes bugs easy to see,  \nAnd programs just flow with delight!", type='output_text', logprobs=[])], role='assistant', status='completed', type='message')], parallel_tool_calls=True, temperature=1.0, tool_choice='auto', tools=[], top_p=1.0, background=False, max_output_tokens=None, max_tool_calls=None, previous_response_id=None, prompt=None, reasoning=Reasoning(effort=None, generate_summary=None, summary=None), service_tier='default', status='completed', text=ResponseTextConfig(format=ResponseFormatText(type='text')), top_logprobs=0, truncation='disabled', usage=ResponseUsage(input_tokens=28, input_tokens_details=InputTokensDetails(cached_tokens=0), output_tokens=41, output_tokens_details=OutputTokensDetails(reasoning_tokens=0), total_tokens=69), user=None, prompt_cache_key=None, safety_identifier=None, store=True)
"""
