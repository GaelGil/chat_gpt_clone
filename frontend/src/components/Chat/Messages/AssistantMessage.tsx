import { MessageDetail } from "@/client";
import { Flex, Box, Loader } from "@mantine/core";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import ToolCall from "./ToolCall";
import Tool from "./Tool";
import { Accordion } from "@mantine/core";
import { FiTool } from "react-icons/fi";

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
          <>
            {message.tool_calls?.map((toolCall) => (
              <Accordion defaultValue="Apples">
                <Accordion.Item key={toolCall.id} value={toolCall.id}>
                  <Tool key={toolCall.id} toolCall={toolCall} />
                  <Accordion.Panel>{toolCall.result}</Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            ))}
          </>
        ) : (
          <></>
        )}

        {message.tool_calls ? (
          <>
            {message.tool_calls?.map((toolCall) => (
              <Accordion defaultValue="Apples">
                <Accordion.Item key={toolCall.id} value={toolCall.id}>
                  <Accordion.Control icon={<FiTool />}>
                    {toolCall.name}
                  </Accordion.Control>
                  <Accordion.Panel>{toolCall.result}</Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            ))}
          </>
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
