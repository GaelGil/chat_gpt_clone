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

  const listItems = items.map(({ title}) => (
          <Flex

            mb="sm"
          >
            <Flex>
              <Box>
                <Text fw={500}>
                  {title}
                </Text>
              </Box>
            </Flex>
          </Flex>
  ));

  return (
        <Box
      w={300}
      h="100vh"

    >
      {/* Header */}
      <Flex align="center" p="md" gap="sm" justify="space-between">
        <Flex align="center" gap="sm">
          <Anchor component={Link} to="/" underline="never">
            <Text fz="xl" fw={700}>
              {PROJECT_NAME}
            </Text>
          </Anchor>
                    <Burger size="sm" />
        </Flex>
      </Flex>

      {/* Controls */}
      <Group px="md" pb="sm" gap="sm" align="center">

        <Anchor component={Link} to="/chat/new" underline="never">
          New chat
        </Anchor>
      </Group>


      {/* Chats Section */}
      <Box p="md" pb={0}>
        <Text fw={600} fz="sm" mb="xs" c="dimmed">
          Chats
        </Text>
      </Box>

      <ScrollArea offsetScrollbars style={{ flex: 1 }}>
        <Box px="md" pb="md">
          {listItems}
        </Box>
      </ScrollArea>
    </Box>
  );
};

export default Chats;