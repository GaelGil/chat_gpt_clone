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
    <div className="text-primary-600 p-2">
      <img src={PROJECT_LOGO} alt="Logo" className="w-10 h-10" />
      {loading ? (
        <p>Loading chats...</p>
      ) : (
        <div className="">
          <h4>
            <span className="text-secondary-300 text-md">Chats</span>
          </h4>

          {chats.map((chat: any) => (
            <div className="flex items-center justify-between group hover:bg-quad-600 rounded">
              <p
                className="text-primary-600 text-sm display: inline-block"
                key={chat.id}
              >
                {chat.name}
              </p>
              <span className="hidden group-hover:inline-block text-gray-500 cursor-pointer">
                ...
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chats;
