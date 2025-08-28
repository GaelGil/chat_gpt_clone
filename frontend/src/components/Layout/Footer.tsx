import { Container, Text, Group, Box } from "@mantine/core";
import { PROJECT_NAME } from "../../data/ProjectName";

const Footer = () => {
  return (
    <Box
      component="footer"
      style={(theme) => ({
        padding: theme.spacing.lg,
      })}
    >
      {" "}
      <Container size="lg">
        <Group>
          <Text size="sm" c="dimmed">
            {PROJECT_NAME} &copy; 2025. All rights reserved.
          </Text>
        </Group>
      </Container>
    </Box>
  );
};

export default Footer;
