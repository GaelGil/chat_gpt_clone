import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@mantine/core";
import InputBar from "@/components/Chat/InputBar";
import InitMessage from "@/components/Chat/Messages/InitMesssage";

// /chat/index.tsx
export const Route = createFileRoute("/chat/")({
  component: NewChat,
});

function NewChat() {
  return (
    <Container>
      <InitMessage />
      <InputBar chatId={undefined} />
    </Container>
  );
}
