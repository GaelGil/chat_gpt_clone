import { NewMessage } from "@/client";
export async function sendMessageStream(
  sessionId: string,
  message: NewMessage,
  signal?: AbortSignal
): Promise<ReadableStream<Uint8Array>> {
  const res = await fetch(`/api/v1/session/${sessionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(message),
    signal,
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  if (!res.body) {
    throw new Error("Response has no body");
  }

  return res.body;
}
