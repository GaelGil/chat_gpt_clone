import { Box, Text, Anchor, Flex, Stack, Image } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { ActionIcon } from "@mantine/core";
import { FiArrowRight, FiColumns } from "react-icons/fi";
import { PROJECT_NAME, LOGO } from "@/const";
// import { FaBars } from "react-icons/fa";
// import { FiLogOut } from "react-icons/fi";
// import type { UserPublic } from "@/client";
// import useAuth from "@/hooks/useAuth";
import { useState } from "react";
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
interface SidebarProps {
  collapsed: boolean;
  toggle: () => void;
}

const ChatSideBar: React.FC<SidebarProps> = ({ collapsed, toggle }) => {
  const [hovered, setHovered] = useState(false);

  const listItems = items.map((item) => (
    <>
      {collapsed ? (
        <></>
      ) : (
        <Flex mb="sm">
          <Link
            to="/chat/$chatId"
            params={{ chatId: item.id.toString() }}
            key={item.id}
          >
            <Text fz={"sm"}>{item.title}</Text>
          </Link>
        </Flex>
      )}
    </>
  ));

  return (
    <Stack>
      {/* Controls */}
      <Flex
        align="center"
        justify={collapsed ? "center" : "space-between"}
        px={collapsed ? "xs" : "md"}
        py="sm"
        gap="sm"
      >
        {collapsed ? (
          <Box
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => {
              toggle();
              setHovered(false);
            }}
            style={{ cursor: "pointer", position: "relative" }}
          >
            {hovered ? (
              <ActionIcon variant="subtle" h={32} w={32}>
                <FiArrowRight size={18} color="var(--mantine-color-text)" />
              </ActionIcon>
            ) : (
              <Image src={LOGO} alt={`${PROJECT_NAME} Logo`} h={25} w={25} />
            )}
          </Box>
        ) : (
          <>
            <Flex align="center" gap="xs">
              <Anchor underline="never" component={Link} to="/">
                <Image src={LOGO} alt={`${PROJECT_NAME} Logo`} h={32} w={32} />
              </Anchor>
              <Text size="xl" fw={700}>
                {PROJECT_NAME}
              </Text>
            </Flex>
            <ActionIcon onClick={toggle} variant="subtle" size="sm">
              <FiColumns size={18} color="var(--mantine-color-text)" />
            </ActionIcon>
          </>
        )}
      </Flex>
      {}
      {!collapsed && (
        <Anchor fw={700} component={Link} to="/chat/new" underline="never">
          New chat
        </Anchor>
      )}

      <Box>{listItems}</Box>
    </Stack>
  );
};

export default ChatSideBar;
