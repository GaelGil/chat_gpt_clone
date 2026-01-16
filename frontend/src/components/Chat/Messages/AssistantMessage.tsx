import { MessageDetail } from "@/client";
import { Flex, Box, Stack, Loader } from "@mantine/core";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
interface MessagesProps {
  message: MessageDetail;
  streamingContent: string;
  streamingMessageId: string | null;
  messageType: string;
}

const AssistantMesssage: React.FC<MessagesProps> = ({
  message,
  streamingContent,
  streamingMessageId,
  messageType,
}) => {
  return (
    <Stack gap="xs" w="100%">
      <Flex key={message.id} justify={"flex-start"}>
        <Box
          p="md"
          bg={"transparent"}
          bdrs="md"
          maw={"60%"}
          style={{
            wordBreak: "break-word",
            textAlign: "left",
          }}
        >
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
              <ReactMarkdown remarkPlugins={[remarkGfm]}>Error</ReactMarkdown>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            )}
          </>
        </Box>
      </Flex>
    </Stack>
  );
};

export default AssistantMesssage;
