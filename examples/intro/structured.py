from Model import LLM
from models.schemas import CalendarEvent

llm = LLM(model_name="gpt-4.1-mini")

# we can create a class like this to give to the model
# it can then return the output in the structure of our class
response = llm.parse_response(
    messages=[
        {"role": "system", "content": "Extract event information"},
        {
            "role": "user",
            "content": "Alice and Bob are going to a science fair on friday",
        },
    ],
    response_format=CalendarEvent,
)

# get the parsed output in the format specified
event = response.output_parsed
# print event
print(event)
