import ChatInterface from "../components/Chat/ChatInterface";
import Chats from "../components/Chat/Chats";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
const ChatPage: React.FC = () => {
  const { user } = useUser();
  return (
    <div className="flex h-screen">
      <section className="w-1/6 bg-tertiary-600 flex flex-col">
        <Chats />
        <div className="mt-auto border-top border-quad-600 p-2">
          <Link className="text-decoration-none" to={`/profile/${user.id}`}>
            <span className="p-2 rounded text-primary-600 hover:bg-quad-600 ">
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
