"use client";

import { Notifications, notifications } from "@mantine/notifications";
import { Button } from "@mantine/core";

export const toaster = {
  show: ({
    id,
    title,
    message,
    color = "blue",
    loading = false,
    closable = true,
    action,
  }: {
    id?: string;
    title?: string;
    message?: string;
    color?: string;
    loading?: boolean;
    closable?: boolean;
    action?: { label: string; onClick: () => void };
  }) => {
    notifications.show({
      id,
      title,
      color,
      withCloseButton: closable,
      loading,
      autoClose: loading ? false : 4000,
      message: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>{message}</span>
          {action && (
            <Button size="xs" onClick={action.onClick} variant="subtle" ml="sm">
              {action.label}
            </Button>
          )}
        </div>
      ),
    });
  },
  update: notifications.update,
  hide: notifications.hide,
  clean: notifications.clean,
};

// Toaster component
export const Toaster = () => {
  return <Notifications position="top-right" zIndex={9999} />;
};
