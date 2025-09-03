import { Container, Text, Group, Box } from "@mantine/core";
import { PROJECT_NAME } from "../../data/ProjectName";
const Footer = () => {
  return (
    <Box component="footer" p="md">
      <Container size="lg">
        <Group justify="center">
          <Text size="sm" c="var(--mantine-color-text-primary)">
            {PROJECT_NAME} &copy; 2025. All rights reserved.
          </Text>
        </Group>
      </Container>
    </Box>
  );
};

export default Footer;
