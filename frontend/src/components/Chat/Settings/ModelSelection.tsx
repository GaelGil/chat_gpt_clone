import { Menu, Button, Text } from "@mantine/core";
import { FiPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
interface ModelSelectionProps {
  value: string;
  onChange: (model: string) => void;
}

const ModelSelection: React.FC<ModelSelectionProps> = ({ value, onChange }) => {
  const models = ["gpt-4.1", "gpt-5.1", "gpt-5-mini", "gpt-5-nano"];
  return (
    <>
      <Menu position="bottom-end" withinPortal>
        <Menu.Target>
          <Button variant="transparent">
            <FiPlus size={"20px"} color="white" />
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          {models.map((model) => (
            <Menu.Item
              key={model}
              onClick={() => onChange(model)}
              leftSection={value === model ? <FaCheck size={12} /> : null} // show check if active
            >
              <Text>{model}</Text>
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default ModelSelection;
