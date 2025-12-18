import { Menu, Button } from "@mantine/core";
import { FiPlus } from "react-icons/fi";

const ModelSelection = () => {
  return (
    <>
      <Menu position="bottom-end" withinPortal>
        <Menu.Target>
          <Button variant="transparent">
            <FiPlus size={"24px"} color="white" />
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>gpt-4.1</Menu.Item>

          <Menu.Item>gpt-5.1</Menu.Item>
          <Menu.Item>gpt-5-mini</Menu.Item>
          <Menu.Item>gpt-5-nano</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default ModelSelection;
