// src/pages/HomePage.tsx
import React, { useState } from "react";
import ChatWindow from "../components/Chat/ChatWindow";
import ChatInput from "../components/Chat/ChatInput";

const HomePage: React.FC = () => {
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);

  const handleSendMessage = (message: string) => {
    const newMessages = [...messages, { text: message, sender: "user" }];
    setMessages(newMessages);

    // Simulate bot response after a delay
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "This is a response from the bot.", sender: "bot" },
      ]);
    }, 1000);
  };

  return (
    <div>
      <div className="d-flex flex-column p-4" style={{ height: "100vh" }}>
        <ChatWindow messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default HomePage;
