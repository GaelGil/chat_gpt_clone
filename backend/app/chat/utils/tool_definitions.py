tool_definitions = [
    {
        "type": "function",
        "name": "wiki_search",
        "description": "Serch Wikipedia for the given query and returns a number of setences on that topic.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query for the wikipedia API, specifying the event topic.",
                },
                "sentences": {
                    "type": "integer",
                    "description": "The number of summary sentences to return.",
                },
            },
            "required": ["query"],
            "additionalProperties": False,
        },
    },
    {
        "type": "function",
        "name": "arxiv_search",
        "description": "Serch arxivfor the given query and returns infrormation on that topic.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query for the arxiv API, specifying the event topic.",
                }
            },
            "required": ["query"],
            "additionalProperties": False,
        },
    },
]
