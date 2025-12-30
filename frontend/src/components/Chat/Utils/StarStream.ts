export async function startStream(
  sessionId: string,
  body: { model_name: string },
  signal?: AbortSignal
) {
  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const url = `/api/v1/session/${sessionId}/stream`;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  if (!response.body) {
    throw new Error("Response has no body");
  }

  return response;
}
