"use client";

import * as React from "react";
import { Box, Button, Group, Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { FaUserAstronaut } from "react-icons/fa";
import { FiLogOut, FiUser } from "react-icons/fi";

import useAuth from "@/hooks/useAuth";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu";

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    logout();
  };

  return (
    <Group>
      <MenuRoot>
        <MenuTrigger>
          <Button
            data-testid="user-menu"
            variant="filled"
            radius="md"
            leftSection={<FaUserAstronaut size={18} />}
          >
            <Text truncate>{user?.full_name || "User"}</Text>
          </Button>
        </MenuTrigger>

        <MenuContent>
          <Link to="/dashboard/settings">
            <MenuItem closeMenuOnClick>
              <Group gap="xs">
                <FiUser size={18} />
                <Box>My Profile</Box>
              </Group>
            </MenuItem>
          </Link>

          <MenuItem onClick={handleLogout}>
            <Group gap="xs">
              <FiLogOut size={18} />
              <Text>Log Out</Text>
            </Group>
          </MenuItem>
        </MenuContent>
      </MenuRoot>
    </Group>
  );
};

export default UserMenu;
