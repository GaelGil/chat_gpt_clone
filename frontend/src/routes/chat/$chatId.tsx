import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@mantine/core";
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
    queryKey: ["messages"],
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
    <Container>
      {messages.length === 0 ? (
        <InitMessage />
      ) : (
        <Messages messages={messages} />
      )}
      <InputBar chatId={chatId ?? ""} />
    </Container>
  );
}
