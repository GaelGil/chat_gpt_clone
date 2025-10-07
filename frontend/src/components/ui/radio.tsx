"use client";

import * as React from "react";
import {
  Radio as MantineRadio,
  RadioGroup as MantineRadioGroup,
  type RadioProps as MantineRadioProps,
  type RadioGroupProps as MantineRadioGroupProps,
  type MantineSize,
} from "@mantine/core";
import type { ReactElement } from "react";
// ---------- Radio ----------
export interface RadioProps extends Omit<MantineRadioProps, "value" | "size"> {
  value: string | number;
  label?: React.ReactNode;
  rootRef?: React.Ref<HTMLDivElement>;
  inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">; // exclude size here
  size?: MantineSize; // only "xs" | "sm" | "md" | "lg" | "xl"
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  function Radio(
    { value, label, rootRef, inputProps, size = "sm", ...rest },
    ref
  ) {
    return (
      <div ref={rootRef}>
        <MantineRadio
          ref={ref}
          value={value.toString()}
          label={label}
          size={size} // guaranteed MantineSize
          {...inputProps} // now safe, no size override
          {...rest}
        />
      </div>
    );
  }
);

// ---------- RadioGroup ----------
export interface RadioGroupProps
  extends Omit<MantineRadioGroupProps, "children" | "value" | "onChange"> {
  value?: string | number;
  onChange?: (value: string) => void;
  children: ReactElement<RadioProps>[]; // <- only allow Radio children
  name?: string;
  orientation?: "vertical" | "horizontal"; // custom prop
  size?: MantineSize; // pass size to children
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(
    {
      value,
      onChange,
      children,
      name,
      orientation = "vertical",
      size = "sm",
      ...rest
    },
    ref
  ) {
    const direction: "row" | "column" =
      orientation === "vertical" ? "column" : "row";

    return (
      <MantineRadioGroup
        ref={ref}
        value={value?.toString()}
        onChange={onChange}
        name={name}
        {...rest}
        style={{ flexDirection: direction }}
      >
        {React.Children.map(children, (child) => {
          if (
            React.isValidElement(child) &&
            (child.type === Radio || // works if child is our Radio component
              // optionally allow JSX type check
              (typeof child.type === "function" &&
                (child.type as any).displayName === "Radio"))
          ) {
            return React.cloneElement(child, { size });
          }
          return child;
        })}
      </MantineRadioGroup>
    );
  }
);
