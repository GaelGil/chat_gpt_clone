import ChatInterface from "../components/Chat/ChatInterface";
import Chats from "../components/Chat/Chats";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getDefaultPhoto } from "../api/helper";
import { Group, Text, Anchor } from "@mantine/core";
import { theme } from "../theme";

const ChatPage: React.FC = () => {
  const { user } = useUser();
  return (
    <Group style={{ height: "100vh" }}>
      {/* <div className="flex h-screen"> */}
      <Group
        style={{
          height: "100vh", // from original inline style
          backgroundColor: theme.colors.brand[3], // from original inline style
          width: "16.6667%", // w-1/6 (1/6 of parent)
          display: "flex", // flex
          flexDirection: "column", // flex-col
        }}
      >
        <Chats />
        <Group
          style={{
            marginTop: "auto",
            borderTop: "1px solid #yourQuad600Color",
            padding: "0.5rem",
          }}
        >
          <Anchor
            component={Link}
            to={`/profile/${user.id}`}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Text c="brand.0" size="sm">
              <img
                src={user.pfp || getDefaultPhoto()}
                alt="Profile Avatar"
                style={{
                  marginRight: "0.5rem",
                  width: "1.5rem",
                  height: "1.5rem",
                  borderRadius: "50%",
                }}
              />
              {user.username}
            </Text>
          </Anchor>
        </Group>
      </Group>
      <Group
        // className="w-5/6 flex flex-col"
        style={{ width: "83.333" }}
      >
        <Group
          className="flex-1 overflow-y-auto"
          style={{ flexGrow: 1, overflowY: "auto" }}
        >
          <ChatInterface />
        </Group>
      </Group>
    </Group>
  );
};

export default ChatPage;
