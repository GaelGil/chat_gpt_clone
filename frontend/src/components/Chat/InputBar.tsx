import { Textarea, Button, Box, Loader } from "@mantine/core";
import { FiArrowUp } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SessionService, NewMessage, NewSession } from "@/client";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";
import type { ApiError } from "@/client/core/ApiError";
import { useForm } from "@mantine/form";
interface InputBarProps {
  chatId: string | undefined;
}
const InputBar: React.FC<InputBarProps> = ({ chatId }) => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const sendMessage = useMutation({
    mutationFn: async (data: NewMessage) => {
      if (chatId === undefined) {
        const newSession: NewSession = { title: "New Chat" };
        await SessionService.newSession({
          requestBody: {
            new_session: newSession,
            new_message: data,
          },
        });
      } else {
        await SessionService.sendMessage({
          sessionId: chatId ?? "",
          requestBody: data,
        });
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
      model_name: "gpt-3.5-turbo",
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
                bg="white"
              >
                {sendMessage.isPending ? (
                  <Loader color="white" />
                ) : (
                  <FiArrowUp size={"24px"} color="black" />
                )}
              </Button>
            </Box>
          )
        }
        {...chatForm.getInputProps("content")}
      />
    </form>
  );
};

export default InputBar;
