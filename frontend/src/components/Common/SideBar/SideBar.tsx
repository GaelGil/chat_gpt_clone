"use client";

// import { useState } from "react";
// import { useQueryClient } from "@tanstack/react-query";
// import { Box, Flex, Text, Button } from "@mantine/core";
import { Box, Flex, Text, Image, Anchor, ActionIcon } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { FiArrowRight, FiColumns } from "react-icons/fi";
import { PROJECT_NAME, LOGO } from "@/const";
// import { FaBars } from "react-icons/fa";
// import { FiLogOut } from "react-icons/fi";
// import type { UserPublic } from "@/client";
// import useAuth from "@/hooks/useAuth";
import SidebarItems from "./SidebarItems";
import { useState } from "react";
// import { DrawerContent, DrawerCloseTrigger } from "../ui/drawer";

interface SidebarProps {
  collapsed: boolean;
  toggle: () => void;
}

const SideBar: React.FC<SidebarProps> = ({ collapsed, toggle }) => {
  const [hovered, setHovered] = useState(false);
  // const queryClient = useQueryClient();
  // const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);
  // const { logout } = useAuth();
  // const [opened, setOpened] = useState(false);

  return (
    <>
      {/* <DrawerContent
        opened={opened} // Mantine uses `opened` instead of `open`
        onClose={() => setOpened(false)} // Mantine uses `onClose` instead of `onOpenChange`
        padding="md"
        size={300}
        position="left"
      >
        <DrawerCloseTrigger>
          <Button variant="subtle" fullWidth mb="sm">
            Close
          </Button>
        </DrawerCloseTrigger>

        <Flex
          direction="column"
          justify="space-between"
          style={{ height: "100%" }}
        >
          <Box>
            <SidebarItems onClose={() => setOpened(false)} />
            <Button onClick={logout} fullWidth mt="sm">
              <FiLogOut /> Log Out
            </Button>
          </Box>

          {currentUser?.email && (
            <Text size="sm" truncate mt="md">
              Logged in as: {currentUser.email}
            </Text>
          )}
        </Flex>
      </DrawerContent> */}

      {/* Mobile trigger button */}
      {/* <Box
        style={(theme) => ({
          display: "flex",
          margin: theme.spacing.md,
        })}
      >
        <Button
          variant="subtle"
          onClick={() => setOpened(true)}
          aria-label="Open Menu"
        >
          <FaBars />
        </Button>
      </Box> */}

      <Flex direction="column" justify="space-between" h="100%">
        <Box>
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
                  <Image
                    src={LOGO}
                    alt={`${PROJECT_NAME} Logo`}
                    h={32}
                    w={32}
                  />
                )}
              </Box>
            ) : (
              <>
                <Flex align="center" gap="xs">
                  <Anchor underline="never" component={Link} to="/">
                    <Image
                      src={LOGO}
                      alt={`${PROJECT_NAME} Logo`}
                      h={32}
                      w={32}
                    />
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

          <SidebarItems collapsed={collapsed} />
        </Box>
      </Flex>
    </>
  );
};

export default SideBar;
