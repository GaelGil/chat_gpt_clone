import { ToolCallDetail } from "@/client";
import { Flex, Box } from "@mantine/core";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

interface ToolProps {
  toolCall: ToolCallDetail;
}

const Tool: React.FC<ToolProps> = ({ toolCall }) => {
  return (
    <Box
      p="md"
      bdrs="md"
      maw={"60%"}
      style={{
        wordBreak: "break-word",
        textAlign: "left",
      }}
    >
      <Flex justify={"space-between"}>
        Called tool {toolCall.name} with args {toolCall.args}
      </Flex>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {toolCall.result}
      </ReactMarkdown>
    </Box>
  );
};

export default Tool;
