import { Textarea } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { startStream } from "../Utils/StarStream";
import { readSSEStream } from "../Utils/readSSEStream";
import { useState } from "react";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
interface InputBarProps {
  chatId: string | undefined;
}
type SendMessageResult = {
  sessionId: string;
  assistantMessageId: string;
};
const InputBar: React.FC<InputBarProps> = ({ chatId }) => {
  const queryClient = useQueryClient();
  const { showErrorToast } = useCustomToast();
  const [partialMessage, setPartialMessage] = useState<string>("");
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
    onSettled: async () => {
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
    const { sessionId, assistantMessageId } =
      await sendMessage.mutateAsync(values);
    const response = await startStream(
      sessionId as string,
      {
        model_name: chatForm.values.model_name,
        message_id: assistantMessageId,
      } as StreamResponseBody
    );
    // readSSEStream(response);
    for await (const token of readSSEStream(response)) {
      setPartialMessage((prev) => prev + token);
      console.log(token);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(chatForm.getValues());
      }}
    >
      {partialMessage && <p>{partialMessage}</p>}
      <Textarea
        placeholder="Ask Anything"
        radius="xl"
        autosize
        w="100%"
        size="lg"
        rightSection={
          chatForm.values.content && (
            <RightSection sendMessage={sendMessage} chatForm={chatForm} />
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
