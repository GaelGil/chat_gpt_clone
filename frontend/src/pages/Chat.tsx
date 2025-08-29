import ChatInterface from "../components/Chat/ChatInterface";
// import Chats from "../components/Chat/Chats";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getDefaultPhoto } from "../api/helper";
import { Flex, Box, Text, Anchor, Group } from "@mantine/core";
import { PROJECT_LOGO } from "../data/ProjectLogo";
import { getUserChats, getChat } from "../api/chat";
import { useState, useEffect } from "react";
import type { Message } from "../types/Chat";

const ChatPage: React.FC = () => {
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
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
    <Flex h="100vh">
      {/* Left: Chats Section (25%) */}
      <Box
        w="20%"
        bg="brand.6"
        display="flex"
        style={{ flexDirection: "column" }}
      >
        <Box flex="1" style={{ overflowY: "auto" }}>
          <Group style={{ width: "100%", padding: "0.5rem" }}>
            <img
              src={PROJECT_LOGO}
              alt="Logo"
              style={{ width: "25px", height: "25px" }}
            />
          </Group>
          {loading ? (
            <p>Loading chats...</p>
          ) : (
            <>
              <Text pl={"sm"} c="brand.8">
                Chats
              </Text>

              {chats.map((chat: any) => (
                <Group c="brand.0">
                  <Text
                    onClick={() => handleChatClick(chat.id)}
                    c="brand.0"
                    variant="filled"
                  >
                    {chat.name}
                  </Text>
                </Group>
              ))}
            </>
          )}
        </Box>

        {/* Footer with profile link */}
        <Box
          style={{
            padding: "0.5rem",
          }}
        >
          <Anchor
            component={Link}
            to={`/profile/${user.id}`}
            display="flex"
            style={{
              alignItems: "center",
            }}
          >
            <img
              src={user.pfp || getDefaultPhoto()}
              alt="Profile Avatar"
              width="10%"
              height="10%"
              style={{
                marginRight: "0.5rem",
                borderRadius: "50%",
              }}
            />
            <Text c="brand.0" size="sm">
              {user.username}
            </Text>
          </Anchor>
        </Box>
      </Box>

      {/* Right: Chat Interface (75%) */}
      <Box w="80%" bg="brand.1" style={{ overflowY: "auto" }}>
        <ChatInterface
          currentMessages={chatMessages}
          isLoadingMessages={isLoadingMessages}
          currentChatId={currentChatId}
        />
      </Box>
    </Flex>
  );
};

export default ChatPage;
