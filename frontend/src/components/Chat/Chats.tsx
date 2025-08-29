import { PROJECT_LOGO } from "../../data/ProjectLogo";
import { getUserChats } from "../../api/chat";
import { useUser } from "../../context/UserContext";
import { useState, useEffect } from "react";
import { Text, Group, Box, NavLink } from "@mantine/core";
import { Link } from "react-router-dom";
const Chats = () => {
  const user = useUser();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchChats = async () => {
    setLoading(true);

    try {
      const data = await getUserChats(user.user.id);
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
    <Box>
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
              <NavLink
                component={Link}
                to={`/chat/${chat.id}`}
                label={chat.name}
                c="brand.0"
                key={chat.id}
                variant="filled"
                active
              />
            </Group>
          ))}
        </>
      )}
    </Box>
  );
};

export default Chats;
