"use client";

import { Button as MantineButton, Loader } from "@mantine/core";
import React from "react";
import type { PolymorphicComponentProps } from "@mantine/utils";

interface ExtraProps {
  loading?: boolean;
  loadingText?: React.ReactNode;
}

type CustomButtonProps = PolymorphicComponentProps<
  typeof MantineButton,
  ExtraProps
>;

export const Button = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  function Button(props, ref) {
    const { loading = false, loadingText, disabled, children, ...rest } = props;

    return (
      <MantineButton
        ref={ref}
        disabled={disabled || loading}
        {...rest} // ✅ correctly typed with loading, onClick, px, component, etc.
      >
        {loading ? (
          loadingText ? (
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
            >
              <Loader size="sm" color="currentColor" />
              {loadingText}
            </span>
          ) : (
            <Loader size="sm" color="currentColor" />
          )
        ) : (
          children
        )}
      </MantineButton>
    );
  }
);
