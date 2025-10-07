import {
  Box,
  SimpleGrid,
  Text,
  Anchor,
  Stack,
  Divider,
  Title,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { PROJECT_NAME } from "@/const";
export function Footer() {
  return (
    <Box px="xl" py="xl" bg={"var(--mantine-color-black)"}>
      <SimpleGrid cols={3} spacing="xl" m={"xl"}>
        {/* Solutions Section */}
        <Stack gap="xs">
          <Title order={3} fw={700}>
            Solutions
          </Title>
          <Anchor component={Link} to="/ai-art-generator" underline="never">
            AI Art Generator
          </Anchor>
          <Anchor component={Link} to="/ai-video-generator" underline="never">
            AI Video Generator
          </Anchor>
          <Anchor
            component={Link}
            to="/transparent-png-generator"
            underline="never"
          >
            Transparent PNG Generator
          </Anchor>
          <Anchor component={Link} to="/ai-marketing-tools" underline="never">
            AI Marketing Tools
          </Anchor>
          <Anchor component={Link} to="/ai-graphic-design" underline="never">
            AI Graphic Design
          </Anchor>
          <Anchor component={Link} to="/ai-print-on-demand" underline="never">
            AI Print on Demand
          </Anchor>
          <Anchor component={Link} to="/ai-photography" underline="never">
            AI Photography
          </Anchor>
          <Anchor component={Link} to="/ai-interior-design" underline="never">
            AI Interior Design
          </Anchor>
          <Anchor component={Link} to="/ai-architecture" underline="never">
            AI Architecture
          </Anchor>
        </Stack>

        {/* About Section */}
        <Stack gap="xs">
          <Title order={3} fw={700}>
            About
          </Title>
          <Anchor component={Link} to="/pricing" underline="never">
            Pricing
          </Anchor>
          <Anchor component={Link} to="/api" underline="never">
            API
          </Anchor>
          <Anchor component={Link} to="/faq" underline="never">
            FAQ
          </Anchor>
          <Anchor component={Link} to="/blog" underline="never">
            Blog
          </Anchor>
          <Anchor component={Link} to="/support" underline="never">
            Support
          </Anchor>
          <Anchor component={Link} to="/contact-us" underline="never">
            Contact us
          </Anchor>
          <Anchor component={Link} to="/careers" underline="never">
            Careers
          </Anchor>
          <Anchor
            component={Link}
            to="/tamayo-creator-program"
            underline="never"
          >
            {PROJECT_NAME} Creator Program
          </Anchor>
        </Stack>

        {/* Additional Links */}
        <Stack gap="xs">
          <Title order={3} fw={700}>
            More
          </Title>
          <Anchor component={Link} to="/affiliate-program" underline="never">
            Affiliate Program
          </Anchor>
          <Anchor component={Link} to="/get-the-app" underline="never">
            Get the App
          </Anchor>
          <Anchor component={Link} to="/stay-tuned" underline="never">
            Stay Tuned
          </Anchor>
        </Stack>
      </SimpleGrid>

      <Divider my="xl" />

      <Text c="dimmed" size="sm">
        &copy; {new Date().getFullYear()} {PROJECT_NAME}. All rights reserved.
      </Text>
    </Box>
  );
}
export default Footer;
