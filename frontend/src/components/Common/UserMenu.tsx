"use client";

import * as React from "react";
import { Box, Button, Group, Text, Avatar } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { FiLogOut } from "react-icons/fi";

import useAuth from "@/hooks/useAuth";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu";

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    logout();
  };

  return (
    <MenuRoot>
      <MenuTrigger>
        <Button
          data-testid="user-menu"
          variant="transparent"
          leftSection={<Avatar radius="xl" variant="transparent" />}
        >
          <Text truncate>{user?.full_name || "User"}</Text>
        </Button>
      </MenuTrigger>

      <MenuContent>
        <Link to="/dashboard/settings">
          <MenuItem closeMenuOnClick>
            <Group gap="xs">
              <Box>My Profile</Box>
            </Group>
          </MenuItem>
        </Link>

        <MenuItem onClick={handleLogout}>
          <Group gap="xs">
            <FiLogOut size={15} />
            <Text>Log Out</Text>
          </Group>
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};

export default UserMenu;
