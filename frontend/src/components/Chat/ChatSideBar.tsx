import {
  Box,
  Group,
  Text,
  Anchor,
  Flex,
  ScrollArea,
  Stack,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";

const items = [
  { title: "Research", link: "https://openai.com/research" },
  { title: "Safety", link: "https://openai.com/safety" },
  { title: "For Business", link: "https://openai.com/business" },
  { title: "For Developers", link: "https://openai.com/developers" },
  { title: "ChatGPT", link: "https://openai.com/chatgpt" },
  { title: "Sora", link: "https://openai.com/sora" },
  { title: "Stories", link: "https://openai.com/stories" },
  { title: "Company", link: "https://openai.com/company" },
  { title: "News", link: "https://openai.com/news" },
  { title: "News", link: "https://openai.com/news" },
  { title: "News", link: "https://openai.com/news" },
  { title: "News", link: "https://openai.com/news" },
  { title: "News", link: "https://openai.com/news" },
];

interface SidebarItemsProps {
  onClose?: () => void;
}

const Chats = ({ onClose }: SidebarItemsProps) => {
  const isLoggedIn = true;

  const listItems = items.map(({ title }) => (
    <Flex mb="sm">
      <Text fz={"sm"}>{title}</Text>
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

      <ScrollArea offsetScrollbars style={{ flex: 1 }}>
        <Box>{listItems}</Box>
      </ScrollArea>
    </Stack>
  );
};

export default Chats;
