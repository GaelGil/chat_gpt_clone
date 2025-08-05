# The Backend

## How to run

### Set your environment variables in ./backend/.env

```python
OPENAI_API_KEY=
COMPOSIO_API_KEY=
```

### Install dependencies

```python
make install
```

### Run

```python
make run
```

# Run server

```python
python -m app.chat.agent.MCP.server
```

In the frontend we get
Error: Failed to send message

but later in the backend we get " advances, it is crucial to address ethical considerations, ensure transparency, and promote equitable access to its benefits. By fostering responsible development and collaboration across sectors, we can harness AI\\\'s power to drive innovation, solve complex problems, and create a more inclusive, efficient, and sustainable future for all."]\']}]', 'filename': 'future_of_ai_essay.txt'}
TOOL CALL RESULTS: [{'result': 'Data successfully saved to future_of_ai_essay.txt'}]

=== CHAT SERVICE: Processing complete ===
[2025-08-05 15:43:30,842][INFO] 127.0.0.1 - - [05/Aug/2025 15:43:30] "POST /api/chat/message HTTP/1.1" 200 -
"
the essay eventuall does get saved to ./backend
