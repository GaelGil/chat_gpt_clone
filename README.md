# Project Description

This is an essay writing AI agent. The idea is that we send a call to the OpenAI model. We provide tools to it, prompt and query. It then returns a plan with tasks that we must execute. Each task is a tool call.
Here is an example workflow/plan:
You can run in docker by going into the root directory of the folder and doing.

## How to Run

## Set Up Environment

In the backend you need to set up a `.env` file with the following

```
DATABASE_URL=
OPENAI_API_KEY=
COMPOSIO_API_KEY=
```

## Run

```sh
docker compose up --build
```

Or you can run them individually like this

```sh
cd ./backend
make install
make run

cd ./frontend
bun run dev


```
