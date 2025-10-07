import * as React from "react";
import {
  Drawer as MantineDrawer,
  DrawerProps as MantineDrawerProps,
} from "@mantine/core";
import { CloseButton } from "./close-button";

interface DrawerContentProps extends Omit<MantineDrawerProps, "children"> {
  portalled?: boolean;
  portalRef?: HTMLElement;
  offset?: MantineDrawerProps["padding"];
  children: React.ReactNode;
  open?: boolean; // <-- add this
  onOpenChange?: (state: { open: boolean }) => void; // <-- add this
}

export const DrawerContent = React.forwardRef<
  HTMLDivElement,
  DrawerContentProps
>(function DrawerContent(props, ref) {
  const { children, portalled = true, offset, ...rest } = props;

  return (
    <MantineDrawer
      ref={ref}
      padding={offset}
      withinPortal={portalled}
      {...rest}
    >
      {children}
    </MantineDrawer>
  );
});

export const DrawerCloseTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof CloseButton>
>(function DrawerCloseTrigger(props, ref) {
  return <CloseButton ref={ref} {...props} />;
});

// Aliases for consistency
export const DrawerRoot = MantineDrawer;
export const DrawerHeader: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <>{children}</>;
export const DrawerBody: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <>{children}</>;
export const DrawerFooter: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <>{children}</>;
export const DrawerBackdrop = MantineDrawer.Overlay;
export const DrawerTitle: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <>{children}</>;
export const DrawerDescription: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <>{children}</>;
export const DrawerActionTrigger: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <>{children}</>;
