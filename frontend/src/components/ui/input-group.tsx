"use client";

import * as React from "react";
import { Box, BoxProps } from "@mantine/core";

export interface InputGroupProps extends BoxProps {
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
  children: React.ReactElement<any>; // your input element
}

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  function InputGroup(props, ref) {
    const { startElement, endElement, children, ...rest } = props;

    const child = React.Children.only(children);

    // clone child and inject Mantine-specific props
    const clonedChild = React.cloneElement(child, {
      icon: startElement ?? child.props.icon,
      rightSection: endElement ?? child.props.rightSection,
      ...child.props,
    });

    return (
      <Box ref={ref} {...rest}>
        {clonedChild}
      </Box>
    );
  }
);
