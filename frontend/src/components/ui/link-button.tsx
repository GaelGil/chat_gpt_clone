"use client";

import * as React from "react";
import { UnstyledButton, UnstyledButtonProps } from "@mantine/core";

export interface LinkButtonProps extends UnstyledButtonProps {
  href: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
}

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  function LinkButton({ href, children, target, rel, ...props }, ref) {
    return (
      <UnstyledButton
        component="a"
        href={href}
        target={target}
        rel={rel}
        ref={ref}
        {...props}
        style={(theme) => ({
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: theme.spacing.sm,
          borderRadius: theme.radius.sm,
          cursor: "pointer",
          textDecoration: "none",
          color: theme.colors.blue[6],
          fontWeight: 500,
        })}
      >
        {children}
      </UnstyledButton>
    );
  }
);
