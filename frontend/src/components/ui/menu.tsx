"use client";

import * as React from "react";
import { Menu as MantineMenu, Group, Box } from "@mantine/core";
import { LuChevronRight } from "react-icons/lu";
// import { console } from "inspector";

interface MenuContentProps {
  children: React.ReactNode;
}

export const MenuContent: React.FC<MenuContentProps> = ({ children }) => {
  return <MantineMenu.Dropdown>{children}</MantineMenu.Dropdown>;
};

export const MenuArrow = () => null; // Mantine menu has no arrow

interface MenuCheckboxItemProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  children: React.ReactNode;
}

export const MenuCheckboxItem: React.FC<MenuCheckboxItemProps> = ({
  checked,
  onChange,
  children,
}) => {
  return (
    <MantineMenu.Item onClick={() => onChange?.(!checked)}>
      {children}
    </MantineMenu.Item>
  );
};

interface MenuRadioItemProps {
  checked?: boolean;
  onChange?: () => void;
  children: React.ReactNode;
}

export const MenuRadioItem: React.FC<MenuRadioItemProps> = ({
  onChange,
  children,
}) => {
  return <MantineMenu.Item onClick={onChange}>{children}</MantineMenu.Item>;
};

interface MenuItemGroupProps {
  title?: string;
  children: React.ReactNode;
}

export const MenuItemGroup: React.FC<MenuItemGroupProps> = ({
  title,
  children,
}) => {
  return (
    <Box style={{ padding: "4px 0" }}>
      {title && <MantineMenu.Label>{title}</MantineMenu.Label>}
      {children}
    </Box>
  );
};

interface MenuTriggerItemProps {
  startIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const MenuTriggerItem: React.FC<MenuTriggerItemProps> = ({
  startIcon,
  children,
}) => {
  return (
    <MantineMenu.Item rightSection={<LuChevronRight />}>
      <Group gap="xs">
        {startIcon}
        {children}
      </Group>
    </MantineMenu.Item>
  );
};

// Aliases
export const MenuRadioItemGroup = MantineMenu; // manage state externally
export const MenuContextTrigger = MantineMenu.Target;
export const MenuRoot = MantineMenu;
export const MenuSeparator = MantineMenu.Divider;
export const MenuItem = MantineMenu.Item;
export const MenuItemText: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <>{children}</>;
export const MenuItemCommand: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <>{children}</>;
export const MenuTrigger = MantineMenu.Target;
