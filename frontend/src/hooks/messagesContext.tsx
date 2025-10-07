import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
// import { GenerationData as Generation } from "@/client/types.gen";
// import { getUserChats, getChat } from "../api/chat";
// import type { Chat, Message, ChatContextType } from "../types/Chat";
// import { useUser } from "./UserContext";
// import { useNavigate } from "react-router-dom";
import useAuth, { isLoggedIn } from "@/hooks/useAuth";
export interface MessageContextType {
  messages: [];
  loadingMessages: boolean;
  setMessages: React.Dispatch<React.SetStateAction<[]>>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);
export const MessagesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchGenerations = async () => {
    if (!isLoggedIn()) return;
    setLoadingMessages(true);
    try {
      //   const data = await getUserChats(user.id);
      // setMessages(["hello", "world"]);
      console.log("Generation:", messages);
    } catch (err) {
      console.error("Error fetching chats:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (user) fetchGenerations();
  }, [user]);

  const value = useMemo(
    () => ({
      messages,
      loadingMessages,
      setMessages,
    }),
    [messages, loadingMessages]
  );

  // provider
  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};

export const useMessages = () => {
  const contex = useContext(MessageContext);
  if (!contex)
    throw new Error("useMessages must be used inside MessagesProvider");
  return contex;
};
