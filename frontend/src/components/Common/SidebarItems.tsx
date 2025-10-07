"use client";

import { Box, Group, Text } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink } from "@tanstack/react-router";
import { FiHome, FiSettings, FiUsers, FiImage, FiEdit2 } from "react-icons/fi";
import type { IconType } from "react-icons/lib";

import type { UserPublic } from "@/client";

const items = [
  { icon: FiHome, title: "Home", path: "/dashboard" },
  { icon: FiEdit2, title: "Canvases", path: "/dashboard/canvases" },
  { icon: FiImage, title: "Gallery", path: "/dashboard/gallery" },
  { icon: FiSettings, title: "User Settings", path: "/dashboard/settings" },
];

interface SidebarItemsProps {
  onClose?: () => void;
}

interface Item {
  icon: IconType;
  title: string;
  path: string;
}

const SidebarItems = ({ onClose }: SidebarItemsProps) => {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

  const finalItems: Item[] = currentUser?.is_superuser
    ? [...items, { icon: FiUsers, title: "Admin", path: "/dashboard/admin" }]
    : items;

  const listItems = finalItems.map(({ icon: Icon, title, path }) => (
    <RouterLink key={title} to={path} onClick={onClose}>
      <Group gap="sm" px="md" py="sm" align="center" fz={"14px"}>
        <Icon size={18} />
        <Text ml={2}>{title}</Text>
      </Group>
    </RouterLink>
  ));

  return (
    <>
      <Text size="xl" px="md" py="sm" fw={700}>
        Menu
      </Text>
      <Box>{listItems}</Box>
    </>
  );
};

export default SidebarItems;
