import { Flex, Box } from "@mantine/core";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

interface ToolCallProps {
  messageId: string;
  streamingContent: string;
}

const ToolCall: React.FC<ToolCallProps> = ({ messageId, streamingContent }) => {
  return (
    <Flex key={messageId} justify={"flex-start"}>
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
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {streamingContent}
        </ReactMarkdown>
      </Box>
    </Flex>
  );
};

export default ToolCall;
