tools = [
    {
        "type": "function",
        "name": "wiki_search",
        "description": "Search Wikipedia for a topic",
        "parameters": {
            "type": "object",
            "properties": {
                "topic": {"type": "string"},
                "senetences": {"type": "number"},
            },
            "required": ["topic"],
            "additionalProperties": False,
        },
        "strict": True,
    },
]
