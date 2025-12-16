import { Box, Text, Anchor, Flex, Stack, Image } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { ActionIcon } from "@mantine/core";
import { FiArrowRight, FiColumns, FiEdit } from "react-icons/fi";
import { PROJECT_NAME, LOGO } from "@/const";
import { useState } from "react";

import Chats from "./Chats";
interface SidebarProps {
  collapsed: boolean;
  toggle: () => void;
}

const ChatSideBar: React.FC<SidebarProps> = ({ collapsed, toggle }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Stack>
      {/* Controls */}
      <Flex
        align="center"
        justify={collapsed ? "center" : "space-between"}
        px={collapsed ? "xs" : "md"}
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
            </Flex>
            <ActionIcon onClick={toggle} variant="subtle" size="sm">
              <FiColumns size={18} color="var(--mantine-color-text)" />
            </ActionIcon>
          </>
        )}
      </Flex>
      {}
      {!collapsed && (
        <>
          <Anchor fw={700} component={Link} to={`/chat`} underline="never">
            <Flex align="center" gap="xs">
              <FiEdit size={18} />
              <Text fz="sm" fw={500}>
                New chat
              </Text>
            </Flex>
          </Anchor>
          <Text c="dimmed" fz="sm">
            Your Chats
          </Text>
          <Chats />
        </>
      )}
    </Stack>
  );
};

export default ChatSideBar;
