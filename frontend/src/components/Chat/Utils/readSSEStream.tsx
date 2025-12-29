export async function readSSEStream(
  stream: ReadableStream<Uint8Array>,
  handlers: {
    onToken: (token: string) => void;
    onDone?: () => void;
    onError?: (err: unknown) => void;
  }
) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const event of events) {
        if (!event.startsWith("data:")) continue;

        const data = event.replace("data:", "").trim();

        if (data === "[DONE]") {
          handlers.onDone?.();
          return;
        }

        handlers.onToken(data);
      }
    }
  } catch (err) {
    handlers.onError?.(err);
  } finally {
    reader.releaseLock();
  }
}
