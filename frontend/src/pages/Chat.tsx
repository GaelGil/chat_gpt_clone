import ChatInterface from "../components/Chat/ChatInterface";
// import Chats from "../components/Chat/Chats";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getDefaultPhoto } from "../api/helper";
import { Flex, Box, Text, Anchor, AppShell, Image } from "@mantine/core";
import { PROJECT_LOGO } from "../data/ProjectLogo";
import { getUserChats, getChat } from "../api/chat";
import { useState, useEffect } from "react";
import type { Message } from "../types/Chat";

const ChatPage: React.FC = () => {
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | "">("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const handleChatClick = async (chatId: string) => {
    setCurrentChatId(chatId);
    setIsLoadingMessages(true);

    try {
      const messages = await getChat(chatId); // API call to fetch messages
      console.log(messages.messages);
      const messagesWithDates = messages.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
      setChatMessages(messagesWithDates);
    } catch (err) {
      console.error("Failed to load chat messages:", err);
      setChatMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const fetchChats = async () => {
    setLoading(true);

    try {
      const data = await getUserChats(user.id);
      console.log(data);
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user]);
  return (
    <AppShell>
      <AppShell.Navbar bg={"brand.6"} p={"xs"} withBorder={false}>
        <Box flex="1">
          <Flex>
            <Image
              src={PROJECT_LOGO}
              alt="Logo"
              w={"25px"}
              h={"25px"}
              width={"100%"}
            />
          </Flex>
          {loading ? (
            <Text c="brand.8">Loading chats ...</Text>
          ) : (
            <Box>
              <Text c="brand.8">Chats</Text>

              {chats.map((chat: any) => (
                <Flex c="brand.0">
                  <Text
                    onClick={() => handleChatClick(chat.id)}
                    c="brand.0"
                    variant="filled"
                  >
                    {chat.name}
                  </Text>
                </Flex>
              ))}
            </Box>
          )}
        </Box>

        <Box>
          <Anchor
            component={Link}
            to={`/profile/${user.id}`}
            display="flex"
            className="hover:bg-red-600"
          >
            <Image
              src={user.pfp || getDefaultPhoto()}
              alt="Profile Avatar"
              w="10%"
              h="10%"
              radius={"xl"}
            />
            <Text c="brand.0" size="sm">
              {user.username}
            </Text>
          </Anchor>
        </Box>
      </AppShell.Navbar>

      <AppShell.Main bg="brand.1">
        <ChatInterface
          currentMessages={chatMessages}
          isLoadingMessages={isLoadingMessages}
          currentChatId={currentChatId}
        />
      </AppShell.Main>
    </AppShell>
  );
};

export default ChatPage;
