import ModelSelection from "../Settings/ModelSelection";
import { Box } from "@mantine/core";
interface LeftSectionProps {
  chatForm: any;
}

const LeftSection: React.FC<LeftSectionProps> = ({ chatForm }) => {
  return (
    <Box w={40}>
      <ModelSelection
        value={chatForm.values.model_name}
        onChange={(model) => chatForm.setFieldValue("model_name", model)}
      />
    </Box>
  );
};

export default LeftSection;
