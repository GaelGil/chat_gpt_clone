import { MessageDetail } from "@/client";
import { Flex, Box, Stack } from "@mantine/core";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
interface MessagesProps {
  messages: MessageDetail[];
}

const Messages: React.FC<MessagesProps> = ({ messages }) => {
  return (
    <Stack gap="xs">
      {messages.map((message) => (
        <Flex
          key={message.id}
          justify={message.role === "user" ? "flex-end" : "flex-start"}
        >
          <Box
            p="md"
            bg={message.role === "user" ? "#303030" : "transparent"}
            bdrs="md"
            style={{
              maxWidth: "60%", // limit bubble width
              wordBreak: "break-word",
              textAlign: message.role === "user" ? "right" : "left",
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </Box>
        </Flex>
      ))}
    </Stack>
  );
};

export default Messages;
