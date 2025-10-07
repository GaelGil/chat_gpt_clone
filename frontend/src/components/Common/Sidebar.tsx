"use client";

// import { useState } from "react";
// import { useQueryClient } from "@tanstack/react-query";
// import { Box, Flex, Text, Button } from "@mantine/core";
import { Box } from "@mantine/core";
// import { FaBars } from "react-icons/fa";
// import { FiLogOut } from "react-icons/fi";
// import type { UserPublic } from "@/client";
// import useAuth from "@/hooks/useAuth";
import SidebarItems from "./SidebarItems";
// import { DrawerContent, DrawerCloseTrigger } from "../ui/drawer";

const Sidebar = () => {
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

      <Box>
        <Box w="100%">
          <SidebarItems />
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
