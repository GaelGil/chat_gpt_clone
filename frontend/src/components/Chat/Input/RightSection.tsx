import { Box, Button } from "@mantine/core";
import { FiArrowUp } from "react-icons/fi";
import { FaSquare } from "react-icons/fa";

interface RightSectionProps {
  sendMessage: { isPending: boolean };
  chatForm: {
    values: { content: string };
    isValid: () => boolean;
  };
}

const RightSection: React.FC<RightSectionProps> = ({
  sendMessage,
  chatForm,
}) => {
  // Only render button if there is content in chatForm
  if (!chatForm.values.content || sendMessage.isPending) return null;

  return (
    <Box>
      <Button
        type="submit"
        disabled={!chatForm.isValid()}
        radius="xl"
        bg={sendMessage.isPending ? "gray" : "white"}
      >
        {sendMessage.isPending ? (
          <FaSquare size={24} color="white" />
        ) : (
          <FiArrowUp size={24} color="black" />
        )}
      </Button>
    </Box>
  );
};

export default RightSection;
