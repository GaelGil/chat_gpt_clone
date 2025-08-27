import ChatInterface from "../components/Chat/ChatInterface";
import Chats from "../components/Chat/Chats";
import { Link } from "react-router-dom";
const ChatPage: React.FC = () => {
  return (
    <div className="flex h-screen">
      <section className="w-1/6 bg-tertiary-600 flex flex-col">
        <Chats />
        <div className="mt-auto border-top border-quad-600 p-2">
          <Link className="text-decoration-none" to="/">
            <span className="text-primary-600">Profile</span>
          </Link>
        </div>
      </section>
      <section className="w-5/6">
        <div className="mt-auto">
          <ChatInterface />
        </div>
      </section>
    </div>
  );
};

export default ChatPage;
