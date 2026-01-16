import { MessageDetail } from "@/client";
import { Flex, Box, Stack } from "@mantine/core";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
interface MessagesProps {
  message: MessageDetail;
}

const UserMesssage: React.FC<MessagesProps> = ({ message }) => {
  return (
    <Stack gap="xs" w="100%">
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
    </Stack>
  );
};

export default UserMesssage;
