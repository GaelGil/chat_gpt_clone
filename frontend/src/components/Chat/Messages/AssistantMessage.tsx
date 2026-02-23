import { MessageDetail } from "@/client";
import { Flex, Box, Loader, Typography, Text } from "@mantine/core";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import ToolCalls from "./ToolCalls";
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
    <Flex key={message.id} justify={"flex-start"}>
      <Text hidden={true}>{messageType} </Text>
      <Box
        p="md"
        bg={"transparent"}
        bdrs="md"
        w={"100%"}
        style={{
          wordBreak: "break-word",
          textAlign: "left",
        }}
      >
        {message.tool_calls && <ToolCalls toolCalls={message.tool_calls} />}

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
            <Typography>
              <>{message.content}</>
            </Typography>
          )}
        </>
      </Box>
    </Flex>
  );
};

export default AssistantMesssage;
