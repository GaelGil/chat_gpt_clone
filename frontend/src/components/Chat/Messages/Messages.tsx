import { MessageDetail } from "@/client";
import { Flex, Box } from "@mantine/core";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
interface MessagesProps {
  messages: MessageDetail[];
}

const Messages: React.FC<MessagesProps> = ({ messages }) => {
  return (
    <>
      {messages.map((message) =>
        message.role === "user" ? (
          <Flex
            key={message.id}
            justify="flex-end"
            m="md"
            bg="#303030"
            bdrs="md"
            w="50%"
          >
            <Box p="lg" bdrs="md" ta="right">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </Box>
          </Flex>
        ) : (
          <Flex key={message.id} justify="flex-start" m="md">
            <Box p="sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content || ""}
              </ReactMarkdown>
            </Box>
          </Flex>
        )
      )}
    </>
  );
};

export default Messages;
