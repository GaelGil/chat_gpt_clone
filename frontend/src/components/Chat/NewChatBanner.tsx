import { Container, Stack, Box, Title } from "@mantine/core";

function NewChatBanner() {
  return (
    <Container size="xl" px="md">
      <Stack align="center" gap="xl" mt={"xl"}>
        <Box ta={"center"}>
          <Title order={2} fw={300} c="white">
            What Can I Help With?
          </Title>
        </Box>
      </Stack>
    </Container>
  );
}

export default NewChatBanner;
