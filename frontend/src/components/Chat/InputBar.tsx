import { useState } from "react";
import { Flex, Textarea, Button } from "@mantine/core";
import { FiSend } from "react-icons/fi";
interface InputBarProps {
  chatId: string | undefined;
}
const InputBar: React.FC<InputBarProps> = ({ chatId }) => {
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
    <>
      <Flex gap="sm" align="flex-end" pos={"relative"}>
        <Textarea
          placeholder="Describe what you want to see"
          radius="xl"
          autosize
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          minRows={3}
          w="100%"
          size="lg"
          mah={"400px"}
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
    </>
  );
};

export default InputBar;
