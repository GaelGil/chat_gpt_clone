import { createFileRoute } from "@tanstack/react-router";
import { Container, Box } from "@mantine/core";
import InputBar from "@/components/Chat/Input/InputBar";
import { SessionService } from "@/client";
import InitMessage from "@/components/Chat/Messages/InitMesssage";
import Messages from "@/components/Chat/Messages/Messages";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import LoadingMessages from "@/components/Pending/LoadingMessages";
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
  // the content of the message that is being streamed
  const [streamingContent, setStreamingContent] = useState("");
  // the id of the message that is being streamed
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );
  const [messageType, setMessageType] = useState("");
  const { data, isLoading, isError } = useQuery({
    ...getUsersQueryOptions({ chatId }),
    enabled: !!chatId,
    placeholderData: (prevData) => prevData,
  });

  if (isLoading) {
    return <LoadingMessages />;
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
        {messages.length === 0 ? (
          <InitMessage />
        ) : (
          <Messages
            messages={messages}
            // pass the streaming content and message id to the Messages component
            streamingContent={streamingContent}
            messageType={messageType}
            streamingMessageId={streamingMessageId}
          />
        )}
      </Box>

      <Box w="100%" bottom={0} pos={"sticky"} p="md">
        <InputBar
          chatId={chatId}
          // pass the streaming content and message id setters to the InputBar component
          setStreamingContent={setStreamingContent}
          setStreamingMessageId={setStreamingMessageId}
          setMessageType={setMessageType}
        />
      </Box>
    </Container>
  );
}
