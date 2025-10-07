"use client";

import { ActionIcon } from "@mantine/core";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { UserPublic } from "@/client";
import DeleteUser from "../Admin/DeleteUser";
import EditUser from "../Admin/EditUser";
import { useState } from "react";
import { MenuContent, MenuRoot, MenuTrigger } from "../ui/menu";
import { Button } from "../ui/button";
import { Menu } from "@mantine/core";

interface UserActionsMenuProps {
  user: UserPublic;
  disabled?: boolean;
}

export const UserActionsMenu = ({ user, disabled }: UserActionsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MenuRoot>
      <MenuTrigger>
        <ActionIcon
          variant="subtle"
          color="gray"
          radius="md"
          aria-label="User actions"
          disabled={disabled}
        >
          <BsThreeDotsVertical size={18} />
        </ActionIcon>
      </MenuTrigger>

      <MenuContent>
        <Menu.Item onClick={() => setIsOpen(true)}>
          <Button>Edit User</Button>
        </Menu.Item>
        <DeleteUser id={user.id} />
      </MenuContent>

      <EditUser user={user} open={isOpen} onClose={() => setIsOpen(false)} />
    </MenuRoot>
  );
};
