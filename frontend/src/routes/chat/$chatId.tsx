import { createFileRoute } from "@tanstack/react-router";
import { Container, Text } from "@mantine/core";
export const Route = createFileRoute("/chat/$chatId")({
  component: ChatDetail,
});

function ChatDetail() {
  const { chatId } = Route.useParams();
  return (
    <Container>
      <Text>Hello "/chat/$chatId"!</Text>
      <Text>{chatId}</Text>
    </Container>
  );
}
