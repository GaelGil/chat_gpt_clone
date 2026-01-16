import { MessageDetail } from "@/client";
import { Flex, Box, Stack, Loader } from "@mantine/core";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef } from "react";
interface MessagesProps {
  messages: MessageDetail[];
  streamingContent: string;
  streamingMessageId: string | null;
  messageType: string;
}

const AssistantMesssage: React.FC<MessagesProps> = ({
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
        <Flex
          key={message.id}
          justify={message.role === "user" ? "flex-end" : "flex-start"}
        >
          <Box
            p="md"
            bg={message.role === "user" ? "#303030" : "transparent"}
            bdrs="md"
            maw={"60%"}
            style={{
              wordBreak: "break-word",
              textAlign: message.role === "user" ? "right" : "left",
            }}
          >
            {message.role === "user" ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            ) : message.role === "assistant" ? (
              <>
                {message.status === "streaming" ? (
                  <>
                    {streamingMessageId === message.id ? (
                      <>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {streamingContent}
                        </ReactMarkdown>
                      </>
                    ) : (
                      <Loader size={"sm"} color="white" />
                    )}
                  </>
                ) : message.status === "failure" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    Error
                  </ReactMarkdown>
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                )}
              </>
            ) : (
              message.content + message.status
            )}
          </Box>
        </Flex>
      ))}
      <div ref={bottomRef} />
    </Stack>
  );
};

export default AssistantMesssage;
