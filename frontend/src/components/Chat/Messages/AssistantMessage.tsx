import { MessageDetail } from "@/client";
import { Flex, Box, Loader } from "@mantine/core";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import ToolCall from "./ToolCall";
import ToolResult from "./ToolResult";
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
  // console.log(
  //   "Assistant message compotnent Streaming message:",
  //   streamingContent
  // );
  // console.log(
  //   "Assistant message compotnent Streaming message type:",
  //   messageType
  // );
  // console.log(
  //   "Assistant message compotnent Streaming message id:",
  //   streamingMessageId
  // );
  return (
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
        {messageType === "tool_call" ? (
          <ToolCall
            messageId={message.id}
            streamingContent={streamingContent}
          />
        ) : messageType === "tool_result" ? (
          <ToolResult
            messageId={message.id}
            streamingContent={streamingContent}
          />
        ) : (
          <></>
        )}

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
  );
};

export default AssistantMesssage;
