import { createFileRoute } from "@tanstack/react-router";
import { Container, Box } from "@mantine/core";
import InputBar from "@/components/Chat/InputBar";
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
    >
      <Box
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
        px="md"
        display={"flex"}
      >
        <InitMessage />
      </Box>

      <Box w="100%" bottom={0} pos={"sticky"} p="md">
        <InputBar chatId={undefined} />
      </Box>
    </Container>
  );
}
