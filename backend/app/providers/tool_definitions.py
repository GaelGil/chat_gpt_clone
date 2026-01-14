tool_definitions = [
    {
        "type": "function",
        "name": "wiki_search",
        "description": "Searches Wikipedia for the given query and returns a summary.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The query to search Wikipedia for.",
                },
                "sentences": {
                    "type": "integer",
                    "description": "Number of summary sentences to return.",
                    "default": 12,
                },
            },
            "required": ["query"],
        },
    },
    {
        "type": "function",
        "name": "arxiv_search",
        "description": "Searches arxiv for the given query and returns a summary.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The query to search arxiv for.",
                },
            },
            "required": ["query"],
        },
    },
]
