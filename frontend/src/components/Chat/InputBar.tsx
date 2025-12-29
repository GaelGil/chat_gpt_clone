import { Textarea, Button, Box } from "@mantine/core";
import { FiArrowUp } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SessionService, NewMessage, NewSession } from "@/client";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";
import type { ApiError } from "@/client/core/ApiError";
import { useForm } from "@mantine/form";
import { FaSquare } from "react-icons/fa";
import { useState } from "react";
import ModelSelection from "./Settings/ModelSelection";
import { useNavigate } from "@tanstack/react-router";
import { sendMessageStream } from "./Utils/sendMessageStream";
import { readSSEStream } from "./Utils/readSSEStream";

interface InputBarProps {
  chatId: string | undefined;
}
const InputBar: React.FC<InputBarProps> = ({ chatId }) => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const navigate = useNavigate();
  const [partialMessage, setPartialMessage] = useState(""); // streaming AI response
  const sendMessage = useMutation({
    mutationFn: async (data: NewMessage) => {
      let sessionId = chatId;

      chatForm.reset();
      if (chatId === undefined) {
        const newSession: NewSession = { title: "New Chat" };
        const newSessionId = await SessionService.newSession({
          requestBody: newSession,
        });
        sessionId = newSessionId;
      }

      const controller = new AbortController();

      const stream = await sendMessageStream(
        sessionId as string,
        data,
        controller.signal
      );

      await readSSEStream(stream, {
        onToken: (token) => {
          setPartialMessage((prev) => prev + token);
        },
        onDone: () => {
          console.log("stream finished");
        },
      });
    },
    onSuccess: (res: any) => {
      const message = res.message;
      showSuccessToast(message);
      chatForm.setFieldValue("prompt", "");
      navigate({ to: `/chat/${res.session_id}` });
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

  // TODO:
  // - correctly stream AI response
  // - add user message on submit (not once ai response is finished)

  const chatForm = useForm<NewMessage>({
    initialValues: {
      content: "",
      model_name: "gpt-5-nano",
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
        // <></>
        <Box
          mt="sm"
          p="sm"
          bg="#f0f0f0"
          style={{ whiteSpace: "pre-wrap", borderRadius: 8 }}
        >
          PARTIAL MESSAGE
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
