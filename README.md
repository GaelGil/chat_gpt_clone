
# ChatGPT Clone
# Overview
In this project I crated a ChatGPT clone. The backend is a Fastapi backend. I set up the OpenAI api for the llm provider. Each call takes in chat history along with some tools it can call if it needs to. A user can sign up, login, create sessions, delete sessions, continue a session etc. Each session is stored as a database instance along with its messages and tool calls. 

The frontend is typescript react. The tokens are streamed to the frontend using websockets. Chat messages are shown along with tool calls in each session.


I created this project to learn full stack and AI agents. This project can be repurposed into another project. It works as a good AI ready template. This project was actually created using this template [here](https://github.com/fastapi/full-stack-fastapi-template/). 


# Screenshots

# Demo
I didnt deploy it. I just deployed the frontend on cloudflare so you can see that [here](https://chatgptclone.gaelgilbello27.workers.dev/)

# Running Locally
To run this locally you will need to set up some environment variables first. Below is a sample `.env` file that must go in `./backend`. Most of this came with the template. 


```
# These came with the template 
DOMAIN=localhost
FRONTEND_HOST=http://localhost:5173
ENVIRONMENT=local
PROJECT_NAME=clone
STACK_NAME=clone
BACKEND_CORS_ORIGINS="http://localhost,http://localhost:5173,https://localhost,https://localhost:5173,http://localhost.tiangolo.com"
SECRET_KEY=
FIRST_SUPERUSER=user@email.com
FIRST_SUPERUSER_PASSWORD=password
SMTP_HOST=
SMTP_USER=
SMTP_PASSWORD=
EMAILS_FROM_EMAIL=info@example.com
SMTP_TLS=True
SMTP_SSL=False
SMTP_PORT=

# you can pass this for docker to create a postgres db 
POSTGRES_SERVER=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=clone

# or pass a database url directly to use a live db
DATABASE_URL=

# These are required to run the chat sessions and all.
OPENAI_API_KEY=
COMPOSIO_API_KEY=
```

Then to start the backend make sure you have Docker installed and running. 
Then from the root directory you can do

~~~
docker compose up --build
~~~

This will build the container. 

Next we have to run migrations. To do that we can do. 
~~~
docker compose exec backend sh
~~~

~~~
alembic upgrade head
~~~

This should set the database up for you with the tables.
Now to start the frontend we just open a new tab and change directory into the frontend. I could have had the docker file include running the frontend
but I figured this would be fine.

~~~
cd frontend/
~~~

I am using Bun so once I am in the directory I just do these following commands.

~~~
bun install
~~~

~~~
bun run dev
~~~


And thats how we can run this locally.
