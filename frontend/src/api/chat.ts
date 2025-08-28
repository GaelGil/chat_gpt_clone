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
