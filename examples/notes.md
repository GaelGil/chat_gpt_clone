# Notes

## LLM's

- is a deep learning model with billions and trillions of parameters trained on lots of data
- takes input and gives immediate output
- no built in tools
- no memory unless including previous context in the input (ie. only looks at current input to produce output)

## AI Agent (in the context of llm)

- uses llms to understand goal, input
- takes in goals
- tools (searchweb, searchdb, api calls, function)
- plans based on goal/input then decides what tools to use or next step to take and when
- not just generating something it plans, reasons and acts based on goal, tools, and goal state
- can take many steps to reach its goal
- has some code/logic that takes in some input and a goal/task
- plant how to achive goal using the tools
- uses the llm to reason, plan (steps/actions), when and what tools to use

## RAG (Retrieval Augmented Generation)

- a llm that answers questions with external data rather than just its training data
- llms take input and return some sort of output. They do this by predicting the next word using their training data.
- this limits llms to only knowledge from last time they were trained/ when the weights were updated.
- for example if I ask a llm "who won the soccer game yesterday". It will make up an answer because was probably not updated any time recently within yesterday. So it has no knowledge of it
- With a RAG system I can ask a llm "who won the soccer game yesterday". Get some context such as recent espn article or a soccer game database. Then pass my query into the llm along side the context
- the llm does not decide when to get context, it is decided in the rag system (our code). We decide when and if we get context to give to the llm.
- general strucure: llm, code/logic (decides if we get context or not, sends query to llm), context (api, database, etc),

## AI agents and workflows

Workflows predefined steps, llm calls to complete a task
For example creating a calender event.
We can create a workflow that takes in user input on the event. Our next predefined step would be to get details on the event, format event details for api call, call the calendar api with a llm call if calendar event does not exist. Then lastly get a confirmation code/message,
If task changes or becomes more complex code needs to change.

An AI agent does all of that on its own with not predefined steps.
For example if we are not able to get all the details on it it might run detail extraction again. Or if we are writing a draft to an essay. It might add a body paragraph or 5. It is not predefined by us.

## small summary

Workflows = fixed layout, you write the steps.
Agents = self-directed systems, the LLM chooses the strategy.

# react style agent is Reason, Act, Observe and Think

# response object attributes

```
['__abstractmethods__', '__annotations__', '__class__', '__class_getitem__', '__class_vars__', '__copy__', '__deepcopy__', '__delattr__', '__dict__', '__dir__', '__doc__', '__eq__', '__fields__', '__fields_set__', '__firstlineno__', '__format__', '__ge__', '__get_pydantic_core_schema__', '__get_pydantic_json_schema__', '__getattr__', '__getattribute__', '__getstate__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__iter__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__pretty__', '__private_attributes__', '__pydantic_complete__', '__pydantic_computed_fields__', '__pydantic_core_schema__', '__pydantic_custom_init__', '__pydantic_decorators__', '__pydantic_extra__', '__pydantic_fields__', '__pydantic_fields_set__', '__pydantic_generic_metadata__', '__pydantic_init_subclass__', '__pydantic_parent_namespace__', '__pydantic_post_init__', '__pydantic_private__', '__pydantic_root_model__', '__pydantic_serializer__', '__pydantic_setattr_handlers__', '__pydantic_validator__', '__reduce__', '__reduce_ex__', '__replace__', '__repr__', '__repr_args__', '__repr_name__', '__repr_recursion__', '__repr_str__', '__rich_repr__', '__setattr__', '__setstate__', '__sizeof__', '__slots__', '__static_attributes__', '__str__', '__subclasshook__', '__weakref__', '_abc_impl', '_calculate_keys', '_copy_and_set_values', '_get_value', '_iter', '_request_id', '_setattr_handler', 'background', 'construct', 'copy', 'created_at', 'dict', 'error', 'from_orm', 'id', 'incomplete_details', 'instructions', 'json', 'max_output_tokens', 'max_tool_calls', 'metadata', 'model', 'model_computed_fields', 'model_config', 'model_construct', 'model_copy', 'model_dump', 'model_dump_json', 'model_extra', 'model_fields', 'model_fields_set', 'model_json_schema', 'model_parametrized_name', 'model_post_init', 'model_rebuild', 'model_validate', 'model_validate_json', 'model_validate_strings', 'object', 'output', 'output_text', 'parallel_tool_calls', 'parse_file', 'parse_obj', 'parse_raw', 'previous_response_id', 'prompt', 'reasoning', 'schema', 'schema_json', 'service_tier', 'status', 'temperature', 'text', 'to_dict', 'to_json', 'tool_choice', 'tools', 'top_logprobs', 'top_p', 'truncation', 'update_forward_refs', 'usage', 'user', 'validate']
```

the `response.output` will return text or or function call we have to check to see what it returned.

<!--  -->

# handleing response text and tool calls

```
if response.output_text:
    print("Model said:", response.output_text)

# proccess function calls
for item in response.output:
    if item.type == "function_call":
        print("Function call:", item.name, json.loads(item.arguments))
```

# Questions and answers on code search project

🧠 1. What Does It Mean to “Stream” Responses From the Code Search Agent?

In the code:

async for chunk in self.\_route_to_code_search_agent(query, context_id, task_id):
yield chunk

This means:

    The Code Search Agent is generating parts of the answer bit by bit (like tokens or lines).

    The orchestrator doesn't wait for a full answer — instead, it streams results back to the UI or client as they’re produced.

This is useful for:

    Fast UI feedback (e.g., like ChatGPT generating text as you watch)

    Long-running processes that return data incrementally

✅ This is why it’s written as an async for — it's waiting for each "chunk" (a response message or result block) from the other agent.

# In general, streaming means:

    🔁 Sending data in small pieces over time instead of all at once.
