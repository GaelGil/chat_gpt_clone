import { Stack } from "@mantine/core"
import { useEffect, useRef } from "react"
import type { MessageDetail } from "@/client"
import AssistantMesssage from "./AssistantMessage"
import UserMesssage from "./UserMessage"

interface MessagesProps {
  messages: MessageDetail[]
  streamingContent: string
  streamingMessageId: string | null
  messageType: string
}

const Messages: React.FC<MessagesProps> = ({
  messages,
  streamingContent,
  streamingMessageId,
  messageType,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  })

  return (
    <Stack gap="xs" w="100%">
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "user" ? (
            <UserMesssage message={message} />
          ) : message.role === "assistant" ? (
            <AssistantMesssage
              message={message}
              streamingContent={streamingContent}
              streamingMessageId={streamingMessageId}
              messageType={messageType}
            />
          ) : (
            <> </>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </Stack>
  )
}

export default Messages
