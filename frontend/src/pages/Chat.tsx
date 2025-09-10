import ChatInterface from "../components/Chat/ChatInterface";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getDefaultPhoto } from "../api/helper";
import {
  Flex,
  Box,
  Text,
  Anchor,
  AppShell,
  Image,
  Title,
  Container,
} from "@mantine/core";
import { PROJECT_LOGO } from "../data/ProjectLogo";
import { useChat } from "../context/ChatContext";
import { Navigate } from "react-router-dom";

const ChatPage: React.FC = () => {
  const { user } = useUser();
  const { chats, selectChat, loadingChats } = useChat();

  if (!user) {
    return <Navigate to="/" replace />;
  }
  return (
    <AppShell
      layout="default"
      navbar={{
        width: "30%",
        breakpoint: "sm",
      }}
    >
      <AppShell.Navbar
        bg={"var(--mantine-color-background-tertiary)"}
        p={"md"}
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
            <Text fw={600} c="var(--mantine-color-text-primary)">
              New Chat
            </Text>
          </Anchor>
          <Title order={3} c="var(--mantine-color-text-tertiary)">
            Chats
          </Title>
          {loadingChats ? (
            <Text c="var(--mantine-color-text-primary)">Loading chats ...</Text>
          ) : (
            <Box>
              {chats.map((chat: any) => (
                <Flex key={chat.id} c="var(--mantine-color-text-primary)">
                  <Anchor
                    onClick={() => selectChat(chat.id)}
                    variant="filled"
                    c="var(--mantine-color-text-primary)"
                    pt={"10px"}
                    fw={500}
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

        <Container>
          <Anchor component={Link} to={`/users/me`} display="flex">
            <Image
              src={user.pfp || getDefaultPhoto()}
              alt="Profile Avatar"
              w="10%"
              h="10%"
              radius={"xl"}
            />
            <Text c="var(--mantine-color-text-primary)" size="sm" px={"xs"}>
              {user.username}
            </Text>
          </Anchor>
        </Container>
      </AppShell.Navbar>

      <AppShell.Main bg={"var(--mantine-color-background-secondary)"}>
        <ChatInterface />
      </AppShell.Main>
    </AppShell>
  );
};

export default ChatPage;
