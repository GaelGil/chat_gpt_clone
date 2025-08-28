import { PROJECT_LOGO } from "../../data/ProjectLogo";
import { getUserChats } from "../../api/chat";
import { useUser } from "../../context/UserContext";
import { useState, useEffect } from "react";
const Chats = () => {
  const user = useUser();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchChats = async () => {
    setLoading(true);

    try {
      const data = await getUserChats(user.user.id);
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
    <div className="text-primary-600 p-2">
      <img src={PROJECT_LOGO} alt="Logo" className="w-10 h-10" />
      {loading ? (
        <p>Loading chats...</p>
      ) : (
        <div className="">
          <h4>
            <span className="text-secondary-300">Chats</span>
          </h4>
          <ul>
            {chats.map((chat: any) => (
              <li key={chat.id}>{chat.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Chats;
