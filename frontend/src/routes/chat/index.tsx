import { createFileRoute } from "@tanstack/react-router";
import { Container, Box, Stack } from "@mantine/core";
import InputBar from "@/components/Chat/Input/InputBar";
import InitMessage from "@/components/Chat/Messages/InitMesssage";

// /chat/index.tsx
export const Route = createFileRoute("/chat/")({
  component: NewChat,
});

function NewChat() {
  return (
    <Container
      fluid
      style={{ display: "flex", flexDirection: "column" }}
      w="75%"
      h="100%"
      mt="15%"
    >
      <Stack align="center">
        <Box ta="center" px="md" display={"flex"}>
          <InitMessage />
        </Box>
        <Box w="100%" bottom={0} pos={"sticky"} p="md" mt="xl">
          <InputBar chatId={undefined} />
        </Box>
      </Stack>
    </Container>
  );
}
