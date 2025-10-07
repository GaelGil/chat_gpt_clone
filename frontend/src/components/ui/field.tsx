"use client";

import * as React from "react";
import { Box, Text } from "@mantine/core";

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  optionalText?: React.ReactNode;
  children: React.ReactNode;
  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  colorPalette?: string;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  function Field(props, ref) {
    const { label, children, helperText, errorText, optionalText, ...rest } =
      props;

    return (
      <Box ref={ref} {...rest} mb="sm">
        {label && (
          <Text w={500} mb={2}>
            {label}{" "}
            {optionalText && (
              <Text component="span" c="dimmed">
                ({optionalText})
              </Text>
            )}
          </Text>
        )}
        {children}
        {helperText && (
          <Text size="sm" c="dimmed" mt={2}>
            {helperText}
          </Text>
        )}
        {errorText && (
          <Text size="sm" c="red" mt={2}>
            {errorText}
          </Text>
        )}
      </Box>
    );
  }
);
