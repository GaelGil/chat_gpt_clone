import * as React from "react";
import { Modal } from "@mantine/core";
import { CloseButton } from "./close-button";

interface DialogContentProps {
  children?: React.ReactNode;
  portalled?: boolean;
  backdrop?: boolean;
  opened: boolean;
  onClose: () => void;
  size?: React.ComponentProps<typeof Modal>["size"];
  centered?: boolean;
  withCloseButton?: boolean;
  [key: string]: any;
}

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(function DialogContent(
  { children, portalled = true, backdrop = true, ...rest },
  ref
) {
  return (
    <Modal
      opened={!!rest.opened}
      onClose={rest.onClose}
      withCloseButton={false} // we use our own CloseButton
      centered={rest.centered}
      size={rest.size}
      withinPortal={portalled}
      {...rest}
      ref={ref}
    >
      {children}
    </Modal>
  );
});

export const DialogRoot = Modal;

interface DialogCloseTriggerProps {
  children?: React.ReactNode;
  onClick?: () => void;
}

export const DialogCloseTrigger = React.forwardRef<
  HTMLButtonElement,
  DialogCloseTriggerProps
>(function DialogCloseTrigger({ children, ...props }, ref) {
  return (
    <CloseButton ref={ref} {...props}>
      {children}
    </CloseButton>
  );
});

export const DialogHeader: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <div style={{ marginBottom: 10, fontWeight: 600 }}>{children}</div>;

export const DialogBody: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <div>{children}</div>;

export const DialogFooter: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <div style={{ marginTop: 20, textAlign: "right" }}>{children}</div>;

export const DialogTitle: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{children}</h2>;

export const DialogDescription: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <p style={{ margin: 0, color: "gray" }}>{children}</p>;

// Placeholder fragments; Mantine handles triggers externally
export const DialogTrigger = React.Fragment;
interface DialogActionTriggerProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const DialogActionTrigger = React.forwardRef<
  HTMLButtonElement,
  DialogActionTriggerProps
>(function DialogActionTrigger({ children, ...props }, ref) {
  return (
    <button ref={ref} {...props}>
      {children}
    </button>
  );
});
