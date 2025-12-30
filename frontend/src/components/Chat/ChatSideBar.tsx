import { Box, Text, Anchor, Flex, Stack, Image } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { ActionIcon } from "@mantine/core";
import { FiArrowRight, FiColumns, FiEdit } from "react-icons/fi";
import { PROJECT_NAME, LOGO } from "@/const";
import { useState } from "react";
import Chats from "./Chats";
import UserMenu from "../Common/UserMenu";

interface SidebarProps {
  collapsed: boolean;
  toggle: () => void;
}

const ChatSideBar: React.FC<SidebarProps> = ({ collapsed, toggle }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Stack h="100%">
      {/* Controls */}
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
          <Flex align="center" justify="space-between" w="100%" mb={"md"}>
            <Anchor underline="never" component={Link} to="/">
              <Image src={LOGO} alt={`${PROJECT_NAME} Logo`} h={32} w={32} />
            </Anchor>

            <ActionIcon onClick={toggle} variant="subtle" size="sm">
              <FiColumns size={18} color="var(--mantine-color-text)" />
            </ActionIcon>
          </Flex>
          <Flex
            direction="column"
            justify="space-between"
            style={{ height: "100%" }}
          >
            {/* Top controls + chats */}
            <Box>
              <Anchor fw={700} component={Link} to={`/chat`} underline="never">
                <Flex align="center" gap="xs" mb={"md"}>
                  <FiEdit size={18} />
                  <Text fz="sm" fw={500}>
                    New chat
                  </Text>
                </Flex>
              </Anchor>
              <Text c="dimmed" fz="sm" mb={"sm"}>
                Your Chats
              </Text>
              <Chats />
            </Box>
            <Box>
              <UserMenu />
            </Box>
          </Flex>
        </>
      )}
    </Stack>
  );
};

export default ChatSideBar;
