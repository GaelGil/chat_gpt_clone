import { Textarea, Button, Box } from "@mantine/core";
import { FiArrowUp } from "react-icons/fi";
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
import { FaSquare } from "react-icons/fa";
import ModelSelection from "./Settings/ModelSelection";
import { useNavigate } from "@tanstack/react-router";
import { startStream } from "./Utils/StarStream";
import { readSSEStream } from "./Utils/readSSEStream";
import { useState } from "react";
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
  const navigate = useNavigate();
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
    onSuccess: (res: any) => {
      chatForm.setFieldValue("prompt", "");
      if (chatId === undefined) {
        navigate({ to: `/chat/${res.session_id}` });
      }
    },
    onError: (err: ApiError) => {
      const body = err.body as { detail?: string } | undefined;
      const message = body?.detail ?? "An error occurred";
      console.error(message);
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
    validateInputOnBlur: true,
  });

  const handleSubmit = async (values: NewMessage) => {
    const { sessionId, assistantMessageId } =
      await sendMessage.mutateAsync(values);
    // start stream
    const response = await startStream(
      sessionId as string,
      {
        model_name: chatForm.values.model_name,
        message_id: assistantMessageId,
      } as StreamResponseBody
    );
    // read stream
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
          !sendMessage.isPending && (
            <Box w={40}>
              <ModelSelection
                value={chatForm.values.model_name}
                onChange={(model) =>
                  chatForm.setFieldValue("model_name", model)
                }
              />
            </Box>
          )
        }
        {...chatForm.getInputProps("content")}
      />
    </form>
  );
};

export default InputBar;
