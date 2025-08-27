import ChatInterface from "../components/Chat/ChatInterface";
import Chats from "../components/Chat/Chats";
const ChatPage: React.FC = () => {
  return (
    <div className="flex h-screen">
      <section className="w-1/5 bg-tertiary-600">
        <Chats />
      </section>
      <section className="w-4/5">
        <ChatInterface />
      </section>
    </div>
  );
};

export default ChatPage;
