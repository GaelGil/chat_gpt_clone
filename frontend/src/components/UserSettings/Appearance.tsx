"use client";

import { Container, Title, Stack, Radio, RadioGroup } from "@mantine/core";
import { useColorMode } from "@/components/ui/color-mode"; // your custom hook

type ColorModeOption = "light" | "dark" | "system";

const Appearance = () => {
  const { colorMode, setColorMode } = useColorMode();

  // For system theme, just fallback to Mantine's colorMode
  const handleChange = (value: ColorModeOption) => {
    if (value === "system") {
      // Implement system preference logic here
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setColorMode(prefersDark ? "dark" : "light");
    } else {
      setColorMode(value);
    }
  };

  return (
    <Container size="xl" px="md">
      <Title order={4} py="md">
        Appearance
      </Title>

      <RadioGroup
        value={colorMode}
        onChange={(value) => handleChange(value as ColorModeOption)}
      >
        <Stack gap="sm" mt="sm">
          <Radio value="system" label="System" />
          <Radio value="light" label="Light Mode" />
          <Radio value="dark" label="Dark Mode" />
        </Stack>
      </RadioGroup>
    </Container>
  );
};

export default Appearance;
