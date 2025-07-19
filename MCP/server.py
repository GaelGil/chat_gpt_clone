import json
import requests
from mcp.server.fastmcp import FastMCP

# import wikipedia
import datetime
# import xml.etree.ElementTree as ET


# Create an MCP server
mcp = FastMCP(
    name="Knowledge Base",
    host="0.0.0.0",  # only used for SSE transport (localhost)
    port=8050,  # only used for SSE transport (set this to any port)
)


# a function to search inside a json file
@mcp.tool(
    name="search_kb",
    description="Get the answer to the users question from the knowledge base",
)
def search_kb() -> dict:
    """
    Load the whole knowledge base from the JSON file.
    (This is a mock function for demonstration purposes, we don't search)
    """
    with open("kb.json", "r") as f:
        return json.load(f)


# get weather tool
@mcp.tool(
    name="get_weather",
    description="Get current temperature for provided coordinates in celsius",
)
def get_weather(latitude, longitude):
    response = requests.get(
        f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
    )
    data = response.json()
    return data["current"]


# wiki search tool
# @mcp.tool(
#     name="wiki_search",
#     description="Get current temperature for provided coordinates in celsius",
# )
# def wiki_search(query: str, sentences: int = 2) -> str:
#     """
#     Searches Wikipedia for the given query and returns a summary.

#     Args:
#         query (str): The search term.
#         sentences (int): Number of summary sentences to return.

#     Returns:
#         str: Summary of the top Wikipedia page match.
#     """
#     try:
#         summary = wikipedia.summary(query, sentences=sentences)
#         return summary
#     except wikipedia.exceptions.DisambiguationError as e:
#         return f"DisambiguationError: The query '{query}' may refer to multiple things:\n{e.options[:5]}"
#     except wikipedia.exceptions.PageError:
#         return f"No Wikipedia page found for '{query}'."
#     except Exception as e:
#         return f"An error occurred: {e}"


@mcp.tool(
    name="save_txt",
    description="Save text to a .txt file",
)
def save_txt(text: str, filename: str = "output.txt") -> str:
    """Saves the provided text to a .txt file."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted_text = f"--- Research Output ---\nTimestamp: {timestamp}\n\n{text}\n\n"

    with open(filename, "a", encoding="utf-8") as f:
        f.write(formatted_text)

    return f"Data successfully saved to {filename}"


@mcp.tool(name="arxiv_search", description="Search arxiv")
def arxiv_search(query: str) -> str:
    """Searches arxiv"""
    pass


# Run the server
if __name__ == "__main__":
    mcp.run(transport="sse")
