import { ActionIcon, type ActionIconProps } from "@mantine/core";
import * as React from "react";
import { LuX } from "react-icons/lu";

export type CloseButtonProps = ActionIconProps;

export const CloseButton = React.forwardRef<
  HTMLButtonElement,
  CloseButtonProps
>(function CloseButton(props, ref) {
  return (
    <ActionIcon variant="light" aria-label="Close" ref={ref} {...props}>
      {props.children ?? <LuX />}
    </ActionIcon>
  );
});
