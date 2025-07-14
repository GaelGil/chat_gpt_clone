import wikipedia
import datetime


def wiki_search(topic: str, sentences: int = 3) -> str:
    try:
        summary = wikipedia.summary(
            topic, sentences=sentences, auto_suggest=False, redirect=True
        )
        return summary
    except Exception as e:
        return f"Could not retrieve Wikipedia content: {e}"


def save_to_txt(data: str, filename: str = "research_output.txt") -> str:
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted_text = f"--- Research Output ---\nTimestamp: {timestamp}\n\n{data}\n\n"

    with open(filename, "a", encoding="utf-8") as f:
        f.write(formatted_text)

    return f"Data successfully saved to {filename}"
