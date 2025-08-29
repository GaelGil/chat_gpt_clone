import { PROJECT_LOGO } from "../../data/ProjectLogo";
import { getUserChats } from "../../api/chat";
import { useUser } from "../../context/UserContext";
import { useState, useEffect } from "react";
import { Text, Group } from "@mantine/core";
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
    <Group>
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
          <Text c="brand.0">Chats</Text>

          {chats.map((chat: any) => (
            <Group className="flex items-center justify-between group hover:bg-quad-600 rounded">
              <Text c="brand.1" key={chat.id}>
                {chat.name}
              </Text>
              <Text className="hidden group-hover:inline-block text-gray-500 cursor-pointer">
                ...
              </Text>
            </Group>
          ))}
        </>
      )}
    </Group>
  );
};

export default Chats;
