import { Box, Button } from "@mantine/core";
import { FiArrowUp } from "react-icons/fi";
import { FaSquare } from "react-icons/fa";
interface RightSectionProps {
  sendMessage: any;
  chatForm: any;
}

const RightSection: React.FC<RightSectionProps> = ({
  sendMessage,
  chatForm,
}) => {
  return (
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
  );
};

export default RightSection;
