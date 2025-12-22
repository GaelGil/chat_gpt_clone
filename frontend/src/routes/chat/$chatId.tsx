import { createFileRoute } from "@tanstack/react-router";
import { Container, Box } from "@mantine/core";
import InputBar from "@/components/Chat/InputBar";
import { SessionService } from "@/client";
import InitMessage from "@/components/Chat/Messages/InitMesssage";
import { useQuery } from "@tanstack/react-query";
import Messages from "@/components/Chat/Messages/Messages";
import { useEffect, useRef } from "react";
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
  const scrollRef = useRef<HTMLDivElement | null>(null);

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
  console.log(messages);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      // instant or smooth as you like
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length, messages?.[messages.length - 1]?.content]);

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
        {/* Scrollable messages area */}
        {messages.length === 0 ? (
          <InitMessage />
        ) : (
          <Box
            ref={scrollRef}
            h="100%"
            mih="100%"
            p="md"
            style={{
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {" "}
            {messages.length === 0 ? (
              <InitMessage />
            ) : (
              <Messages messages={messages} />
            )}
          </Box>
        )}
      </Box>

      <Box w="100%" bottom={0} pos={"sticky"} p="md">
        <InputBar chatId={chatId} />
      </Box>
    </Container>
  );
}
