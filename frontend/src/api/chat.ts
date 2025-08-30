import { BASE_URL } from "./url";

export const getUserChats = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/api/chat/users/${userId}/chats`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    return new Error("Error");
  }
  const data = await res.json();
  return data;
};

export const createChat = async (name: string) => {
  const res = await fetch(`${BASE_URL}/api/chat/craete`, {
    method: "POST",
    credentials: "include", // include cookies if your auth relies on them
    headers: {
      "Content-Type": "application/json", // tell server it's JSON
    },
    body: JSON.stringify({
      name: name,
    }),
  });
  if (!res.ok) {
    return new Error("Error");
  }
  const data = await res.json();
  return data;
};

export const getChat = async (chatId: string) => {
  const res = await fetch(`${BASE_URL}/api/chat/users/${chatId}/get`, {
    method: "GET",
    credentials: "include", // include cookies if your auth relies on them
    headers: {
      "Content-Type": "application/json", // tell server it's JSON
    },
  });
  if (!res.ok) {
    return new Error("Error");
  }
  const data = await res.json();
  return data;
};

export const deleteChat = async (chatId: string) => {
  const res = await fetch(`${BASE_URL}/api/chat/delete`, {
    method: "DELETE",
    credentials: "include", // include cookies if your auth relies on them
    headers: {
      "Content-Type": "application/json", // tell server it's JSON
    },
    body: JSON.stringify({
      id: chatId,
    }),
  });
  if (!res.ok) {
    return new Error("Error");
  }
  const data = await res.json();
  return data;
};

export const sendChatMessage = async (message: string, chatId: string) => {
  const streamUrl = `${BASE_URL}/api/chat/message/stream?t=${Date.now()}`;
  const res = await fetch(streamUrl, {
    method: "POST",
    credentials: "include", // include cookies if your auth relies on them
    headers: {
      "Content-Type": "application/json", // tell server it's JSON
      Accept: "text/event-stream", // optional but descriptive
    },
    body: JSON.stringify({
      message: message,
      chatId: chatId,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Stream failed: ${res.status} ${text}`);
  }
  return res;
};
