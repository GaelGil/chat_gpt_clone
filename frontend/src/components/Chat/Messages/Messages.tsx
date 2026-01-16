import { MessageDetail } from "@/client";
import { Stack } from "@mantine/core";
import { useEffect, useRef } from "react";
import UserMesssage from "./UserMessage";
import AssistantMesssage from "./AssistantMessage";
interface MessagesProps {
  messages: MessageDetail[];
  streamingContent: string;
  streamingMessageId: string | null;
  messageType: string;
}

const Messages: React.FC<MessagesProps> = ({
  messages,
  streamingContent,
  streamingMessageId,
  messageType,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages.length]);
  return (
    <Stack gap="xs" w="100%">
      {messages.map((message) => (
        <>
          {message.role === "user" ? (
            <UserMesssage message={message} />
          ) : message.role === "assistant" ? (
            <AssistantMesssage
              message={message}
              streamingContent={streamingContent}
              streamingMessageId={streamingMessageId}
              messageType={messageType}
            />
          ) : (
            <> </>
          )}
        </>
      ))}
      <div ref={bottomRef} />
    </Stack>
  );
};

export default Messages;
