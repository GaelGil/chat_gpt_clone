import { Container, Stack, Box, Title } from "@mantine/core";

const InitMessage = () => {
  return (
    <Container>
      <Stack align="center" gap="xl" mt={"xl"}>
        <Box ta={"center"}>
          <Title order={2} fw={300} c="white">
            What Can I Help With?
          </Title>
        </Box>
      </Stack>
    </Container>
  );
};

export default InitMessage;
