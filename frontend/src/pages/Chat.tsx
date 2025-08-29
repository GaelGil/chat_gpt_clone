import ChatInterface from "../components/Chat/ChatInterface";
import Chats from "../components/Chat/Chats";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getDefaultPhoto } from "../api/helper";
import { Flex, Box, Text, Anchor } from "@mantine/core";

const ChatPage: React.FC = () => {
  const { user } = useUser();
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
          <Chats />
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
        <ChatInterface />
      </Box>
    </Flex>
  );
};

export default ChatPage;
