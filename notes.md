# Notes

## LLM's

- is a deep learning model with billions and trillions of parameters trained on lots of data
- takes input and gives immediate output
- no built in tools
- no memory unless including previous context in the input (ie. only looks at current input to produce output)

## AI Agent (in the context of llm)

- uses llms to understand
- takes in goals
- tools (searchweb, searchdb, api calls, function)
- plans based on goal/input then decides what tools to use or next step to take and when
- not just generating something it plans, reasons and acts bsed on goal, tools, and goal state
- can take many steps to reach its goal

## RAG (Retrieval Augmented Generation)

- a llm that answers questions with external data rather than just its training data
- llms take input and return some sort of output. They do this by predicting the next word using their training data.
- this limits llms to only knowledge from last time they were trained/ when the weights were updated.
- for example if I ask a llm "who won the soccer game yesterday". It will make up an answer because was probably not updated any time recently within yesterday. So it has no knowledge of it
- With a RAG system I can ask a llm "who won the soccer game yesterday". Get some context such as recent espn article or a soccer game database. Then pass my query into the llm along side the context
- the llm does not decide when to get context, it is decided in the rag system (our code). We decide when and if we get context to give to the llm.
- general strucure: llm, code/logic (decides if we get context or not, sends query to llm), context (api, database, etc),
