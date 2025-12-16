import { Flex, Text } from "@mantine/core";
import { MessageDetail } from "@/client";
interface MessagesProps {
  messages: MessageDetail[];
}

const Messages: React.FC<MessagesProps> = ({ messages }) => {
  return (
    <>
      <Flex gap="sm" align="flex-end" pos={"relative"}>
        <Text>Hello "/chat/$chatId"!</Text>
      </Flex>
    </>
  );
};

export default Messages;
