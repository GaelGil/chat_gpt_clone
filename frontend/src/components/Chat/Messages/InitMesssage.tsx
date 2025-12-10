import { Flex, Text } from "@mantine/core";

const InitMessage = () => {
  return (
    <>
      <Flex gap="sm" align="flex-end" pos={"relative"}>
        <Text>Hello "/chat/$chatId"!</Text>
      </Flex>
    </>
  );
};

export default InitMessage;
