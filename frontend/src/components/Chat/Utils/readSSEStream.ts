export async function* readSSEStream(
  response: Response
): AsyncGenerator<any, void, unknown> {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error("No response body");
  }

  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      // Process complete lines
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.trim() === "") continue;

        // Parse SSE format
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          try {
            const chunk = JSON.parse(data);
            yield chunk;
          } catch (e) {
            console.error("Failed to parse chunk:", e);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
