import { MessageDetail } from "@/client";
import { Flex, Box } from "@mantine/core";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
interface MessagesProps {
  message: MessageDetail;
}

const UserMesssage: React.FC<MessagesProps> = ({ message }) => {
  return (
    <Flex key={message.id} justify={"flex-end"}>
      <Box
        p="md"
        bg={"#303030"}
        bdrs="md"
        maw={"60%"}
        style={{
          wordBreak: "break-word",
          textAlign: "right",
        }}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content}
        </ReactMarkdown>
      </Box>
    </Flex>
  );
};

export default UserMesssage;
