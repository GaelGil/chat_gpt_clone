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
