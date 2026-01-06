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
      yield buffer;
      buffer += decoder.decode(value, { stream: true });
      console.log("Raw chunk from stream:", buffer);
    }
  } finally {
    reader.releaseLock();
  }
}
