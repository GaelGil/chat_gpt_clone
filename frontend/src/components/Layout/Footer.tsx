import { Container, Text, Group, Box } from "@mantine/core";
import { PROJECT_NAME } from "../../data/ProjectName";
const Footer = () => {
  return (
    <Box
      component="footer"
      style={{
        padding: "1rem 0",
        // backgroundColor: theme.colors.brand[4],
      }}
    >
      <Container size="lg">
        <Group justify="center">
          <Text size="sm" c="brand.1">
            {PROJECT_NAME} &copy; 2025. All rights reserved.
          </Text>
        </Group>
      </Container>
    </Box>
  );
};

export default Footer;
