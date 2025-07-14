import wikipedia


class WikipediaTool:
    def search(self, topic: str, sentences: int = 3) -> str:
        try:
            summary = wikipedia.summary(
                topic, sentences=sentences, auto_suggest=False, redirect=True
            )
            return summary
        except Exception as e:
            return f"Could not retrieve Wikipedia content: {e}"
