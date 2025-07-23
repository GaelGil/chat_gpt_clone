// src/components/ChatWindow.tsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Message from "./Message";

interface ChatWindowProps {
  messages: { text: string; sender: "user" | "bot" }[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <Container
      className="d-flex flex-column p-3"
      style={{ height: "70vh", overflowY: "auto" }}
    >
      {messages.map((msg, index) => (
        <Row key={index}>
          <Col>
            <Message text={msg.text} sender={msg.sender} />
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default ChatWindow;
