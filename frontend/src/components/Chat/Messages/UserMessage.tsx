import { Box, Flex } from "@mantine/core"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { MessageDetail } from "@/client"

interface MessagesProps {
  message: MessageDetail
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
  )
}

export default UserMesssage
