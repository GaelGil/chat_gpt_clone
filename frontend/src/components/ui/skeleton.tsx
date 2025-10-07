"use client";

import * as React from "react";
import {
  Skeleton as MantineSkeleton,
  Stack,
  Box,
  type SkeletonProps as MantineSkeletonProps,
  type MantineSize,
} from "@mantine/core";

export interface SkeletonCircleProps extends MantineSkeletonProps {
  size?: MantineSize | number; // Mantine allows sizes or numbers
}

export const SkeletonCircle = React.forwardRef<
  HTMLDivElement,
  SkeletonCircleProps
>(function SkeletonCircle({ size = "md", ...rest }, ref) {
  return (
    <Box
      ref={ref}
      style={{
        borderRadius: "50%",
        width: typeof size === "number" ? size : undefined,
        height: typeof size === "number" ? size : undefined,
      }}
    >
      <MantineSkeleton height={size} width={size} {...rest} />
    </Box>
  );
});

export interface SkeletonTextProps extends MantineSkeletonProps {
  noOfLines?: number;
  gap?: number | string;
}

export const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  function SkeletonText({ noOfLines = 3, gap = 8, ...rest }, ref) {
    return (
      <Stack gap={gap} ref={ref}>
        {Array.from({ length: noOfLines }).map((_, index) => (
          <MantineSkeleton
            key={index}
            height={16}
            radius="sm"
            style={index === noOfLines - 1 ? { maxWidth: "80%" } : undefined}
            {...rest}
          />
        ))}
      </Stack>
    );
  }
);

export const Skeleton = MantineSkeleton;
