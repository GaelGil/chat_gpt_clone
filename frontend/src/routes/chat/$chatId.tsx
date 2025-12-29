import { createFileRoute } from "@tanstack/react-router";
import { Container, Box } from "@mantine/core";
import InputBar from "@/components/Chat/InputBar";
import { SessionService } from "@/client";
import InitMessage from "@/components/Chat/Messages/InitMesssage";
import Messages from "@/components/Chat/Messages/Messages";
import { useQuery } from "@tanstack/react-query";
export const Route = createFileRoute("/chat/$chatId")({
  component: ChatDetail,
});

function getUsersQueryOptions({ chatId }: { chatId: string }) {
  return {
    queryFn: () => SessionService.getSession({ sessionId: chatId }),
    queryKey: ["messages", chatId],
  };
}
function ChatDetail() {
  const { chatId } = Route.useParams();

  const { data, isLoading, isError } = useQuery({
    ...getUsersQueryOptions({ chatId }),
    enabled: !!chatId,
    placeholderData: (prevData) => prevData,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const messages = data?.messages ?? [];

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
        w="100%"
        display={"flex"}
      >
        {/* Scrollable messages area */}
        {messages.length === 0 ? (
          <InitMessage />
        ) : (
          <Messages messages={messages} />
        )}
      </Box>

      <Box w="100%" bottom={0} pos={"sticky"} p="md">
        <InputBar chatId={chatId} />
      </Box>
    </Container>
  );
}
