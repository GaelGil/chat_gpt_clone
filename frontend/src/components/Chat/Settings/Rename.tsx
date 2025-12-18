import { Button, Input } from "@mantine/core";
import { SessionSimple } from "@/client";
import { FiCheck, FiX } from "react-icons/fi";
interface ModelSelectionProps {
  item: SessionSimple;
}

const Rename: React.FC<ModelSelectionProps> = ({ item }) => {
  return (
    <>
      <Input
        type="text"
        defaultValue={item.title}
        rightSection={
          <>
            <Button>
              <FiCheck />
            </Button>
            <Button>
              <FiX />
            </Button>
          </>
        }
      />
    </>
  );
};

export default Rename;
