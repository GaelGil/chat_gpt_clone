import { Box, Text, Anchor, Flex, Stack } from "@mantine/core";
import { Link } from "@tanstack/react-router";

const items = [
  { id: 0, title: "Research", link: "https://openai.com/research" },
  { id: 1, title: "Safety", link: "https://openai.com/safety" },
  { id: 2, title: "For Business", link: "https://openai.com/business" },
  { id: 3, title: "For Developers", link: "https://openai.com/developers" },
  { id: 4, title: "ChatGPT", link: "https://openai.com/chatgpt" },
  { id: 5, title: "Sora", link: "https://openai.com/sora" },
  { id: 6, title: "Stories", link: "https://openai.com/stories" },
  { id: 7, title: "Company", link: "https://openai.com/company" },
  { id: 8, title: "News", link: "https://openai.com/news" },
  { id: 9, title: "News", link: "https://openai.com/news" },
  { id: 10, title: "News", link: "https://openai.com/news" },
  { id: 11, title: "News", link: "https://openai.com/news" },
  { id: 12, title: "News", link: "https://openai.com/news" },
];
const Chats = () => {
  const listItems = items.map((item) => (
    <Flex mb="sm">
      <Link
        to="/chat/$chatId"
        params={{ chatId: item.id.toString() }}
        key={item.id}
      >
        <Text fz={"sm"}>{item.title}</Text>
      </Link>
    </Flex>
  ));

  return (
    <Stack>
      {/* Controls */}
      <Anchor component={Link} to="/chat/new" underline="never">
        New chat
      </Anchor>

      {/* Chats Section */}
      <Text fw={600} fz="sm" mb="xs" c="dimmed">
        Chats
      </Text>

      {/* <ScrollArea style={{ flex: 1, maxHeight: "300px" }} offsetScrollbars> */}
      <Box>{listItems}</Box>
      {/* </ScrollArea> */}
    </Stack>
  );
};

export default Chats;
