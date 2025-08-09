# Project Description

This is an essay writing AI agent. The idea is that we send a call to the OpenAI model. We provide tools to it, prompt and query. It then returns a plan with tasks that we must execute. Each task is a tool call.
Example workflow

Query: Write an essay on the ...

Agent:
Creates Plan (ie, do research, write intro, ... return essay)
Executes tasks in the Plan

# How to run

### Start the Frontend

```
cd frontend
npm i
npm run dev
```

Go to [localhost](http://localhost:5173/)

### Start the MCP server

```
cd backend
uv venv
source .venv/bin/activate
make install
make mcp
```

### Start the Backend

```
cd backend
uv venv
source .venv/bin/activate
make install
make run
```

# Demo

![Prompt Submitted](./images/prompt.png "The Prompt")

![Second to Last Result](./images/second_last_result.png "Second to Last Result")

![Last Result](./images/last_result.png "Last Result")
