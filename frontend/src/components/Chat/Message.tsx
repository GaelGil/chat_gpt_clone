// src/components/Message.tsx
import React from "react";
import { Card } from "react-bootstrap";

interface MessageProps {
  text: string;
  sender: "user" | "bot";
}

const Message: React.FC<MessageProps> = ({ text, sender }) => {
  return (
    <Card
      className={`mb-3 ${
        sender === "bot" ? "bg-light" : "bg-primary text-white"
      }`}
      style={{
        maxWidth: "80%",
        alignSelf: sender === "bot" ? "flex-start" : "flex-end",
      }}
    >
      <Card.Body>{text}</Card.Body>
    </Card>
  );
};

export default Message;
