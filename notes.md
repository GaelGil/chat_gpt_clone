# Notes

## LLM's

- a machine learning model
- take input and give immediate output
- no built in tools
- input to output is immedieate

## AI Agent (in the context of llm)

- uses llms to understand
- takes in goals
- tools (searchweb, searchdb, api calls, function)
- plans based on goal/input (ie, what tools to use)
- not just generating something it plans , reasons and acts bsed on goal, tools, and goal state
- can take many steps to reach its goal

## RAG (Retrieval Augmented Generation)

- a llm that answers questions with external data rather than just its training data
- llms take input and return some sort of output. They do this by predicting the next word using their training data.
- this limits llms to only knowledge from last time they were trained/ when the weights were updated.
- for example if I ask a llm "who won the soccer game yesterday". It will make up an answer because was probably not updated any time recently within yesterday. So it has no knowledge of it
- With a RAG system I can ask a llm "who won the soccer game yesterday". Give some context to my llm such as recent espn article or a soccer game database.
