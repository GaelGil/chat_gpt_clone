from langchain_community.tools import WikipediaQueryRun, DuckDuckGoSearchRun
from langchain_community.utilities import WikipediaAPIWrapper
from datetime import datetime
from typing import Callable, Any

TOOL_REGISTRY: dict[str, Callable[..., Any]] = {}
# ... any nummber and type of args
# Any any return type
def register_tool(name: str) -> Callable[[Callable[..., Any]], Callable[..., Any]]:
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        TOOL_REGISTRY[name] = func
        return func
    return decorator



@register_tool('save_text_to_file')
def save_to_txt(data: str, filename: str = "./research_output.txt") -> str:
    timestamp: datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted_text: str = f"--- Research Output ---\nTimestamp: {timestamp}\n\n{data}\n\n"

    with open(filename, "a", encoding="utf-8") as f:
        f.write(formatted_text)
    
    return f"Data successfully saved to {filename}"


search = DuckDuckGoSearchRun()

@register_tool('search_web')
def search_web(query: str) -> str:
    return search.run(query)



api_wrapper = WikipediaAPIWrapper(top_k_results=1, doc_content_chars_max=100)
wiki_query_tool = WikipediaQueryRun(api_wrapper=api_wrapper)

@register_tool('wiki_query')
def wiki_query(query: str) -> str:
    return wiki_query_tool.run(query=query)
