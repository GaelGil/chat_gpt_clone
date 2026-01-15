import json
import xml.etree.ElementTree as ET

import requests
import wikipedia


class Tools:
    def __init__(self):
        self.ARXIV_NAMESPACE = "{http://www.w3.org/2005/Atom}"

    def wiki_search(
        self, query: str, sentences: int = 2
    ) -> tuple[str | None, str | None]:
        """
        Searches Wikipedia for the given query and returns a summary.

        Args:
            query (str): The search term.
            sentences (int): Number of summary sentences to return.

        Returns:
            tuple[str | None, str, None]: A tuple containing the summary and an error message.
        """
        try:
            summary = wikipedia.summary(query, sentences=sentences)
            return summary, None
        except wikipedia.exceptions.DisambiguationError as e:
            return (
                None,
                f"DisambiguationError: The query '{query}' may refer to multiple things:\n{e.options[:5]}",
            )
        except wikipedia.exceptions.PageError:
            return None, f"No Wikipedia page found for '{query}'."
        except Exception as e:
            return None, f"An error occurred: {e}"

    def arxiv_search(self, query: str) -> tuple[str | None, str | None]:
        """Searches arxiv"""
        url = f"http://export.arxiv.org/api/query?search_query=all:{query}&start=0&max_results=1"

        try:
            res = requests.get(url, timeout=10)
            res.raise_for_status()
            et_root = ET.fromstring(res.content)
            entry = et_root.find(f"{self.ARXIV_NAMESPACE}entry")

            if entry is None:
                return None, f"No arXiv results found for '{query}'."

            title = entry.find(f"{self.ARXIV_NAMESPACE}title").text.strip()
            summary = entry.find(f"{self.ARXIV_NAMESPACE}summary").text.strip()
            return json.dumps({"title": title, "summary": summary}), None

        except requests.exceptions.RequestException as e:
            return None, f"Network error: {e}"
        except ET.ParseError:
            return None, "Error parsing arXiv response"
        except Exception as e:
            return None, f"Unexpected error: {e}"
