import { Textarea } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SessionService, NewMessage, NewSession, Role, Status } from "@/client";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";
import type { ApiError } from "@/client/core/ApiError";
import { useForm } from "@mantine/form";
import LeftSection from "./LeftSection";
import { useState } from "react";
import { useMessageSocket } from "@/hooks/useMessageSocket";
import RightSection from "./RightSection";
import { useRef, useEffect } from "react";
interface InputBarProps {
  chatId: string | undefined;
  setStreamingContent: (value: string) => void;
  setStreamingMessageId: (id: string | null) => void;
  setMessageType: (value: string) => void;
  setIsStreaming: (value: boolean) => void;
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
  setIsStreaming,
}) => {
  const queryClient = useQueryClient();
  const { showErrorToast } = useCustomToast();
  const [newMessageId, setNewMessageId] = useState("");
  const pendingChatRef = useRef<{
    sessionId: string;
    assistantMessageId: string;
    model_name: string;
  } | null>(null);

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
      queryClient.refetchQueries({ queryKey: ["messages", chatId] });
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
      const { sessionId, assistantMessageId } =
        await sendMessage.mutateAsync(values);
      pendingChatRef.current = {
        sessionId,
        assistantMessageId,
        model_name: values.model_name,
      };
      setNewMessageId(assistantMessageId);
      // Use sessionId (returned from mutation) instead of chatId (might be undefined for new sessions)
      await queryClient.refetchQueries({
        queryKey: ["messages", sessionId],
      });
    } catch (err) {
      console.error("Error sending message or streaming:", err);
    }
  };

  const { streamingMessage, isStreaming, messageType } = useMessageSocket({
    messageId: newMessageId,
    pendingChatRef,
    onMessageComplete: () => {
      queryClient.invalidateQueries({ queryKey: ["session", chatId] });
    },
  });
  // Pass streaming content to parent component
  useEffect(() => {
    setStreamingContent(streamingMessage);
  }, [streamingMessage, setStreamingContent]);
  // Set streaming message ID immediately when newMessageId is set
  useEffect(() => {
    if (newMessageId) {
      setStreamingMessageId(newMessageId);
    }
  }, [newMessageId, setStreamingMessageId]);

  // Update message type in parent
  useEffect(() => {
    if (messageType) {
      setMessageType(messageType);
    }
  }, [messageType, setMessageType]);

  // Pass isStreaming to parent
  useEffect(() => {
    setIsStreaming(isStreaming);
  }, [isStreaming, setIsStreaming]);

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
          <RightSection sendMessage={sendMessage} chatForm={chatForm} />
        }
        leftSection={
          <LeftSection sendMessage={sendMessage} chatForm={chatForm} />
        }
        {...chatForm.getInputProps("content")}
      />
    </form>
  );
};

export default InputBar;
