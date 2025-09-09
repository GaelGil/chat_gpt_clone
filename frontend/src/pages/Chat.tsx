import ChatInterface from "../components/Chat/ChatInterface";
// import Chats from "../components/Chat/Chats";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getDefaultPhoto } from "../api/helper";
import { Flex, Box, Text, Anchor, AppShell, Image, Title } from "@mantine/core";
import { PROJECT_LOGO } from "../data/ProjectLogo";
// import { getUserChats, getChat } from "../api/chat";
// import { useState, useEffect } from "react";
// import type { Message } from "../types/Chat";
import { useChat } from "../context/ChatContext";
import { Navigate } from "react-router-dom";

const ChatPage: React.FC = () => {
  const { user } = useUser();
  // const [chats, setChats] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [currentChatId, setCurrentChatId] = useState<string | "" | undefined>(
  //   undefined
  // );
  // const [chatMessages, setChatMessages] = useState<Message[]>([]);
  // const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const { chats, selectChat, loadingChats } = useChat();

  // const handleChatClick = async (chatId: string) => {
  //   if (!chatId) {
  //     setCurrentChatId(undefined); // reset current chat
  //     setChatMessages([]); // clear messages
  //     setIsLoadingMessages(false); // reset loading
  //     return;
  //   }
  //   setCurrentChatId(chatId);
  //   setIsLoadingMessages(true);

  //   try {
  //     // API call to fetch messages
  //     const messages = await getChat(chatId);
  //     // convert timestamp strings to Date objects
  //     const messagesWithDates = messages.messages.map((msg: any) => ({
  //       ...msg,
  //       timestamp: new Date(msg.timestamp),
  //     }));
  //     // set messages
  //     setChatMessages(messagesWithDates);
  //   } catch (err) {
  //     console.error("Failed to load chat messages:", err);
  //     setChatMessages([]);
  //   } finally {
  //     setIsLoadingMessages(false);
  //   }
  // };

  // const fetchChats = async () => {
  //   setLoading(true);
  //   try {
  //     const data = await getUserChats(user.id);
  //     setChats(data);
  //   } catch (error) {
  //     console.error("Error fetching chats:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchChats();
  // }, [user]);{

  if (!user) {
    return <Navigate to="/" replace />;
  }
  return (
    <AppShell
      layout="default" // 👈 important: pushes Main, doesn't overlap
      navbar={{
        width: "30%", // 👈 percentage width
        breakpoint: "sm", // optional: collapse on small screens
        // collapsed: { mobile: false },
      }}
    >
      <AppShell.Navbar
        bg={"var(--mantine-color-background-tertiary)"}
        p={"xs"}
        withBorder={false}
        opacity={1}
        w={"260px"}
      >
        <Box flex="1">
          <Flex>
            <Image src={PROJECT_LOGO} alt="Logo" w="10%" h="10%" />
          </Flex>
          <Anchor
            component={Link}
            to="/chat"
            underline="never"
            onClick={() => selectChat("")}
          >
            <Text c="var(--mantine-color-text-primary)">New Chat</Text>
          </Anchor>
          {loadingChats ? (
            <Text c="var(--mantine-color-text-primary)">Loading chats ...</Text>
          ) : (
            <Box>
              <Title order={3} c="var(--mantine-color-text-tertiary)">
                Chats
              </Title>

              {chats.map((chat: any) => (
                <Flex c="var(--mantine-color-text-primary)">
                  <Anchor
                    onClick={() => selectChat(chat.id)}
                    variant="filled"
                    c="var(--mantine-color-text-primary)"
                    pt={"10px"}
                    underline="never"
                    style={{ cursor: "pointer" }}
                  >
                    {chat.name}
                  </Anchor>
                </Flex>
              ))}
            </Box>
          )}
        </Box>

        <Box>
          <Anchor component={Link} to={`/profile/${user.id}`} display="flex">
            <Image
              src={user.pfp || getDefaultPhoto()}
              alt="Profile Avatar"
              w="10%"
              h="10%"
              radius={"xl"}
            />
            <Text c="var(--mantine-color-text-primary)" size="sm">
              {user.username}
            </Text>
          </Anchor>
        </Box>
      </AppShell.Navbar>

      <AppShell.Main bg={"var(--mantine-color-background-secondary)"}>
        <ChatInterface />
      </AppShell.Main>
    </AppShell>
  );
};

export default ChatPage;
