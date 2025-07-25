from openai import OpenAI


def stream_llm(prompt: str) -> Generator[str, None]:
    """Stream LLM response.

    Args:
        prompt (str): The prompt to send to the LLM.

    Returns:
        Generator[str, None, None]: A generator of the LLM response.
    """
    client = genai.Client(vertexai=False, api_key=GOOGLE_API_KEY)
    for chunk in client.models.generate_content_stream(
        model="gemini-2.5-flash-lite",
        contents=prompt,
    ):
        yield chunk.text
