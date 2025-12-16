import { useState } from "react";
import { Flex, Textarea, Button } from "@mantine/core";
import { FiSend } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SessionService, NewMessage } from "@/client";
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
    mutationFn: async (data: NewMessage) =>
      await SessionService.sendMessage({
        sessionId: chatId ?? "",
        requestBody: data,
      }),
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
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const chatForm = useForm<NewMessage>({
    initialValues: {
      content: "",
      session_id: "",
      model_name: "",
      prev_messages: [],
    },
    validateInputOnBlur: true,
    validate: {
      content: (value) => (value ? null : "Message is required"),
    },
  });

  const handleSubmit = () => {
    console.log("Prompt:", prompt);
    setIsDisabled(!isDisabled);
    setPrompt("");
    // setTimeout(() => {
    setIsDisabled(!isDisabled);
    // }, 1000);
  };

  // Form state
  const [prompt, setPrompt] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <form
      onSubmit={chatForm.onSubmit((values) => {
        sendMessage.mutate(values);
      })}
    >
      <Flex gap="sm" align="flex-end" pos={"relative"}>
        <Textarea
          placeholder="Ask Anything"
          radius="xl"
          w="100%"
          size="lg"
          mah={"400px"}
          {...chatForm.getInputProps("prompt")}
        />
        <Button
          radius="xl"
          size="lg"
          loading={isDisabled}
          variant="outline"
          onClick={handleSubmit}
        >
          <FiSend size={18} />
        </Button>
      </Flex>
    </form>
  );
};

export default InputBar;
