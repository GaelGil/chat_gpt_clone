import { Box, Group, Text, Button, Anchor, Flex, Burger, ActionIcon, Input, Avatar, Badge, ScrollArea
 } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { PROJECT_NAME } from "@/const";

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
];

interface SidebarItemsProps {
  onClose?: () => void;
}



const Chats = ({ onClose }: SidebarItemsProps) => {
  const isLoggedIn = true;

  const listItems = items.map(({ title, link }) => (
            <a key={title} href={link} onClick={onClose}>
        <Text ml={2}>{title}</Text>
      </a>
  ));

  return (
        <Box
      w={300}
      h="100vh"

    >
      {/* Header */}
      <Flex align="center" p="md" gap="sm" justify="space-between">
        <Flex align="center" gap="sm">
          <Burger size="sm" />
          <Anchor component={Link} to="/" underline="never">
            <Text fz="xl" fw={700}>
              {PROJECT_NAME}
            </Text>
          </Anchor>
        </Flex>
      </Flex>

      {/* Controls */}
      <Group px="md" pb="sm" gap="sm" align="center">
        <Input
          placeholder="Search chats"
          radius="md"
          size="sm"
        />
        <Button  size="sm">
          New chat
        </Button>
      </Group>


      {/* Chats Section */}
      <Box p="md" pb={0}>
        <Text fw={600} fz="sm" mb="xs">
          Chats
        </Text>
      </Box>

      <ScrollArea offsetScrollbars style={{ flex: 1 }}>
        <Box px="md" pb="md">
          {/* Example Chat Item */}
          <Flex
            align="center"
            justify="space-between"
            p="xs"
            mb="xs"

          >
            <Flex align="center" gap="sm">
              <Avatar radius="md">AI</Avatar>
              <Box>
                <Text fw={500} fz="sm">
                  New Chat
                </Text>
                <Text fz="xs" c="dimmed">
                  Last message preview
                </Text>
              </Box>
            </Flex>
            <Group gap={4}>
              <Badge size="sm">2</Badge>
              <ActionIcon variant="subtle" size="sm">
              </ActionIcon>
            </Group>
          </Flex>

          {/* Add more placeholder chats */}
          <Flex
            align="center"
            justify="space-between"
            p="xs"
            mb="xs"

          >
            <Flex align="center" gap="sm">
              <Avatar radius="md">UX</Avatar>
              <Box>
                <Text fw={500} fz="sm">
                  Design Discussion
                </Text>
                <Text fz="xs" c="dimmed">
                  Let’s review the layout
                </Text>
              </Box>
            </Flex>
            <ActionIcon variant="subtle" size="sm">
            </ActionIcon>
          </Flex>
        </Box>
      </ScrollArea>
    </Box>
  );
};

export default Chats;