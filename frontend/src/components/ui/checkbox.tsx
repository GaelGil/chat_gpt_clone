"use client";

import * as React from "react";
import {
  Checkbox as MantineCheckbox,
  type CheckboxProps as MantineCheckboxProps,
  type MantineSize,
} from "@mantine/core";

// ---------- Checkbox ----------
export interface CheckboxProps extends Omit<MantineCheckboxProps, "icon"> {
  icon?: React.ReactNode; // custom icon
  inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">;
  rootRef?: React.Ref<HTMLDivElement>;
  size?: MantineSize; // optional size prop
  children?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { icon, inputProps, rootRef, children, size = "sm", label, ...rest },
    ref
  ) {
    return (
      <div ref={rootRef}>
        <MantineCheckbox
          ref={ref}
          size={size}
          {...rest}
          {...inputProps}
          // Mantine accepts a function for custom icon
          icon={icon ? () => icon : undefined}
          label={label}
        />
      </div>
    );
  }
);
