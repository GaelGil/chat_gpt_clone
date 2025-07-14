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
    {
        "type": "function",
        "name": "save_to_txt",
        "description": "Save structured data to a text file",
        "parameters": {
            "type": "object",
            "properties": {
                "filename": {"type": "string"},
            },
            "additionalProperties": False,
        },
        "strict": True,
    },
]
