import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { getUserChats, getChat } from "../api/chat";
import type { Chat, Message, ChatContextType } from "../types/Chat";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext<ChatContextType | undefined>(undefined);
export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [chats, setChats] = useState<Chat[]>([]);
  const navigate = useNavigate();
  // const params = useParams<{ chatId?: string }>();
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(
    undefined
  );
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchChats = async () => {
    if (!user) return;
    setLoadingChats(true);
    try {
      const data = await getUserChats(user.id);
      setChats(data);
    } catch (err) {
      console.error("Error fetching chats:", err);
    } finally {
      setLoadingChats(false);
    }
  };

  const selectChat = async (chatId: string | undefined) => {
    setCurrentChatId(chatId);
    navigate(chatId ? `/chat/${chatId}` : "/chat");
    if (!chatId) {
      setCurrentMessages([]);
      return;
    }

    setLoadingMessages(true);
    try {
      const messages = await getChat(chatId);
      const normalized = messages.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
      setCurrentMessages(normalized);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setCurrentMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (user) fetchChats();
  }, [user]);

  const value = useMemo(
    () => ({
      chats,
      currentChatId,
      currentMessages,
      loadingChats,
      loadingMessages,
      fetchChats,
      selectChat,
    }),
    [chats, currentChatId, currentMessages, loadingChats, loadingMessages]
  );

  // provider
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const contex = useContext(ChatContext);
  if (!contex) throw new Error("useChat must be used inside ChatProvider");
  return contex;
};
