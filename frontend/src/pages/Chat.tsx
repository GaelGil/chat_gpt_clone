import ChatInterface from "../components/Chat/ChatInterface";
import Chats from "../components/Chat/Chats";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getDefaultPhoto } from "../api/helper";

const ChatPage: React.FC = () => {
  const { user } = useUser();
  return (
    <div className="flex h-screen">
      <section className="w-1/6 bg-tertiary-600 flex flex-col">
        <Chats />
        <div className="mt-auto border-top border-quad-600 p-2">
          <Link
            className="text-decoration-none hover:bg-quad-600"
            to={`/profile/${user.id}`}
          >
            <span className="p-2 rounded text-primary-600 flex flex-row items-center">
              <img
                src={user.pfp || getDefaultPhoto()}
                alt="Profile Avatar"
                className="rounded-full mr-2 w-6 h-6 object-cover"
              />
              {user.username}
            </span>
          </Link>
        </div>
      </section>
      <section className="w-5/6 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <ChatInterface />
        </div>
      </section>
    </div>
  );
};

export default ChatPage;
