export async function* readSSEStream(
  response: Response
): AsyncGenerator<string> {
  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE events are separated by a blank line
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const event of events) {
        const lines = event.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;

          const data = line.replace(/^data:\s*/, "");

          if (data === "[DONE]") return;

          yield data; // ← plain text token
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
