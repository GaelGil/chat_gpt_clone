import { Textarea, Button, Box } from "@mantine/core";
import { FiArrowUp, FiPlus } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SessionService, NewMessage, NewSession } from "@/client";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";
import type { ApiError } from "@/client/core/ApiError";
import { useForm } from "@mantine/form";
import { FaSquare } from "react-icons/fa";
import { useState } from "react";
import ModelSelection from "./Settings/ModelSelection";
interface InputBarProps {
  chatId: string | undefined;
}
const InputBar: React.FC<InputBarProps> = ({ chatId }) => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const [partialMessage, setPartialMessage] = useState(""); // streaming AI response
  const sendMessage = useMutation({
    mutationFn: async (data: NewMessage) => {
      chatForm.reset();
      let sessionId = chatId;
      if (chatId === undefined) {
        const newSession: NewSession = { title: "New Chat" };
        const newSessionId = await SessionService.newSession({
          requestBody: newSession,
        });
        sessionId = newSessionId;
      }
      const res: any = await SessionService.sendMessage({
        sessionId: sessionId as string,
        requestBody: data,
      });

      if (!res.body) throw new Error("No response body from server");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;

      setPartialMessage(""); // reset before streaming
      while (!done) {
        const { value: chunk, done: readerDone } = await reader.read();
        done = readerDone;
        if (chunk) {
          const text = decoder.decode(chunk);
          setPartialMessage((prev) => prev + text); // append chunk
        }
      }
    },
    onSuccess: (res: any) => {
      const message = res.message;
      showSuccessToast(message);
      chatForm.setFieldValue("prompt", "");
    },
    onError: (err: ApiError) => {
      const body = err.body as { detail?: string } | undefined;
      const message = body?.detail ?? "An error occurred";
      console.error(message);
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
      model_name: "gpt-4.1-mini",
    },
    validateInputOnBlur: true,
  });

  return (
    <form
      onSubmit={chatForm.onSubmit((values) => {
        sendMessage.mutate(values);
      })}
    >
      {/* Display partial AI response live */}
      {partialMessage && (
        <Box
          mt="sm"
          p="sm"
          bg="#f0f0f0"
          style={{ whiteSpace: "pre-wrap", borderRadius: 8 }}
        >
          {partialMessage}
        </Box>
      )}
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
              <ModelSelection />
            </Box>
          )
        }
        {...chatForm.getInputProps("content")}
      />
    </form>
  );
};

export default InputBar;
