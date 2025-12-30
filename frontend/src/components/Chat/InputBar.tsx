import { Textarea, Button, Box } from "@mantine/core";
import { FiArrowUp } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SessionService, NewMessage, NewSession, Role, Status } from "@/client";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";
import type { ApiError } from "@/client/core/ApiError";
import { useForm } from "@mantine/form";
import { FaSquare } from "react-icons/fa";
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
      SessionService.addMessage({
        sessionId: sessionId as string,
        requestBody: data,
      });
      SessionService.addMessage({
        sessionId: sessionId as string,
        requestBody: {
          content: "",
          role: "assistant" as Role,
          model_name: data.model_name,
          status: "streaming" as Status,
        } as NewMessage,
      });
    },
    onSuccess: (res: any) => {
      const message = res.message;
      showSuccessToast(message);
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
    onSettled: () => {
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

  return (
    <form
      onSubmit={chatForm.onSubmit((values) => {
        sendMessage.mutate(values);
      })}
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
