import { useState, useRef, useEffect } from "react";
import ChatMessage from "../Chat/ChatMessage";
import ChatInput from "../Chat/ChatInput";
import Logo from "../../data/Logo";
// import { BASE_URL } from "../../api/const";
import { PROJECT_NAME } from "../../api/const";
import { io, Socket } from "socket.io-client";
export interface ChatBlock {
  type: "thinking" | "redacted_thinking" | "text" | "tool_use" | "tool_result";
  content?: string;
  tool_name?: string;
  tool_input?: any;
  tool_result?: any;
  tool_id?: string;
  iteration?: number;
}

export interface ChatResponse {
  blocks: ChatBlock[];
  stop_reason: string;
  total_iterations: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  response?: ChatResponse;
  timestamp: Date;
  isLoading?: boolean;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current = io("http://localhost:8080/chat");

    socket.current.on("connect", () => {
      console.log("Connected");
    });

    socket.current.on("log", (data: { message: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
          isLoading: true,
        },
      ]);
    });

    socket.current.on("final_response", (data) => {
      setMessages((prev) => {
        const newMessages = [...prev];
        for (let i = newMessages.length - 1; i >= 0; i--) {
          if (newMessages[i].role === "assistant" && newMessages[i].isLoading) {
            newMessages[i] = {
              ...newMessages[i],
              content: "Assistant response", // or data.response content
              response: data.response,
              isLoading: false,
              timestamp: new Date(),
            };
            break;
          }
        }
        return newMessages;
      });
      setIsLoading(false);
    });

    return () => {
      socket.current?.off("log");
      socket.current?.off("final_response");
      socket.current?.disconnect();
    };
  }, []);

  // Replace fetch with socket emit:
  const sendMessage = (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    socket.current?.emit("user_message", { message: content });
  };

  return (
    <div className=" bg-white">
      {/* Chat Section */}
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#ffffff] to-[#eceaff] rounded-lg flex items-center justify-center p-1">
              <Logo size="sm" className="" />
            </div>
            <p className="text-xl p-0 m-0 font-semibold text-gray-900">
              {PROJECT_NAME}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Your Personal Essay Writing Assistant
              </h2>
              <p className="text-gray-600 mb-2 max-w-md mx-auto">
                I can help you write an essay on any topic or review an existing
                essay.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}

      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
