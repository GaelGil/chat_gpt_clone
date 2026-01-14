import json
import xml.etree.ElementTree as ET

import requests
import wikipedia


class Tools:
    def __init__(self):
        self.ARXIV_NAMESPACE = "{http://www.w3.org/2005/Atom}"

    def wiki_search(self, query: str, sentences: int = 2) -> str:
        """
        Searches Wikipedia for the given query and returns a summary.

        Args:
            query (str): The search term.
            sentences (int): Number of summary sentences to return.

        Returns:
            str: Summary of the top Wikipedia page match.
        """
        try:
            summary = wikipedia.summary(query, sentences=sentences)
            return summary
        except wikipedia.exceptions.DisambiguationError as e:
            return f"DisambiguationError: The query '{query}' may refer to multiple things:\n{e.options[:5]}"
        except wikipedia.exceptions.PageError:
            return f"No Wikipedia page found for '{query}'."
        except Exception as e:
            return f"An error occurred: {e}"

    def arxiv_search(self, query: str) -> str:
        """Searches arxiv"""
        url = f"http://export.arxiv.org/api/query?search_query=all:{query}&start=0&max_results=1"
        res = requests.get(url)
        et_root = ET.fromstring(res.content)
        for entry in et_root.findall(f"{self.ARXIV_NAMESPACE}entry"):
            title = entry.find(f"{self.ARXIV_NAMESPACE}title").text.strip()
            summary = entry.find(f"{self.ARXIV_NAMESPACE}summary").text.strip()
        return json.dumps({"title": title, "summary": summary})
