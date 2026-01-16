import { Textarea, Button, Box } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaSquare } from "react-icons/fa";
import { FiArrowUp } from "react-icons/fi";
import {
  SessionService,
  NewMessage,
  NewSession,
  Role,
  Status,
  StreamResponseBody,
} from "@/client";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";
import type { ApiError } from "@/client/core/ApiError";
import { useForm } from "@mantine/form";
import LeftSection from "./LeftSection";
import { useState, useEffect } from "react";
import { useMessageSocket } from "@/hooks/useMessageSocket";
// import RightSection from "./RightSection";
interface InputBarProps {
  chatId: string | undefined;
  setStreamingContent: (value: string) => void;
  setStreamingMessageId: (id: string | null) => void;
  setMessageType: (value: string) => void;
}
type SendMessageResult = {
  sessionId: string;
  assistantMessageId: string;
};
const InputBar: React.FC<InputBarProps> = ({
  chatId,
  setStreamingContent,
  setStreamingMessageId,
  setMessageType,
}) => {
  const queryClient = useQueryClient();
  const { showErrorToast } = useCustomToast();
  const [newMessageId, setNewMessageId] = useState("");

  const sendMessage = useMutation<SendMessageResult, ApiError, NewMessage>({
    mutationFn: async (data: NewMessage): Promise<SendMessageResult> => {
      let sessionId = chatId;

      chatForm.reset();
      // create new session if chatId is undefined
      if (chatId === undefined) {
        const newSession: NewSession = { title: "New Chat" };

        const newSessionId = await SessionService.newSession({
          requestBody: newSession,
        });
        sessionId = newSessionId;
      }
      // send user message
      await SessionService.addMessage({
        sessionId: sessionId as string,
        requestBody: data,
      });
      // send assistant message (blank for now)
      const assistantMessageId = await SessionService.addMessage({
        sessionId: sessionId as string,
        requestBody: {
          content: "",
          role: "assistant" as Role,
          model_name: data.model_name,
          status: "streaming" as Status,
        } as NewMessage,
      });

      return {
        sessionId: sessionId as string,
        assistantMessageId,
      };
    },
    onSuccess: () => {
      chatForm.setFieldValue("prompt", "");
    },
    onError: (err: ApiError) => {
      const body = err.body as { detail?: string } | undefined;
      const message = body?.detail ?? "An error occurred";
      showErrorToast(message);
      handleError(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
    },
  });

  const chatForm = useForm<NewMessage>({
    initialValues: {
      content: "",
      model_name: "gpt-5-nano",
    },
  });

  const handleSubmit = async (values: NewMessage) => {
    try {
      // Send the message and get IDs
      const { sessionId, assistantMessageId } =
        await sendMessage.mutateAsync(values);

      // Invalidate
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
      // Set new assistant message as newMessageId
      setNewMessageId(assistantMessageId);

      // Start chat
      SessionService.chat({
        sessionId: sessionId as string,
        requestBody: {
          model_name: values.model_name,
          message_id: assistantMessageId,
        } as StreamResponseBody,
      });
    } catch (err) {
      console.error("Error sending message or streaming:", err);
    }
  };

  // Get message and streatming status from socket
  const res = useMessageSocket({
    messageId: newMessageId,
    onMessageComplete: () => {
      queryClient.invalidateQueries({ queryKey: ["session", chatId] });
    },
  });
  // If we are streaming, update the content and message id
  // these are used to display the message in Messages.tsx
  useEffect(() => {
    if (res.isStreaming && res.streamingMessage) {
      setStreamingContent(res.streamingMessage);
      setStreamingMessageId(newMessageId);
      setMessageType(res.messageType);
    }
  }, [res.isStreaming, res.streamingMessage, ""]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(chatForm.getValues());
      }}
    >
      <Textarea
        placeholder="Ask Anything"
        radius="xl"
        autosize
        w="100%"
        size="lg"
        rightSection={
          chatForm.values.content && (
            <Box>
              <Button
                type="submit"
                disabled={!chatForm.isValid()}
                radius="xl"
                bg={sendMessage.isPending ? "gray" : "white"}
              >
                {sendMessage.isPending ? (
                  <FaSquare size={"24px"} color="white" />
                ) : (
                  <FiArrowUp size={"24px"} color="black" />
                )}
              </Button>
            </Box>
          )
        }
        leftSection={
          !sendMessage.isPending && <LeftSection chatForm={chatForm} />
        }
        {...chatForm.getInputProps("content")}
      />
    </form>
  );
};

export default InputBar;
