import { Box } from "@mantine/core"
import ModelSelection from "../Settings/ModelSelection"

interface LeftSectionProps {
  chatForm: any
  sendMessage: { isPending: boolean }
}

const LeftSection: React.FC<LeftSectionProps> = ({ chatForm, sendMessage }) => {
  if (sendMessage.isPending) return null
  return (
    <Box w={40}>
      <ModelSelection
        value={chatForm.values.model_name}
        onChange={(model) => chatForm.setFieldValue("model_name", model)}
      />
    </Box>
  )
}

export default LeftSection
