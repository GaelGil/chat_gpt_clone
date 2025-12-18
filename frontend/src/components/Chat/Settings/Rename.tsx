import { Input } from "@mantine/core";
import { SessionSimple } from "@/client";
interface ModelSelectionProps {
  item: SessionSimple;
}

const Rename: React.FC<ModelSelectionProps> = ({ item }) => {
  return (
    <>
      <Input type="text" defaultValue={item.title} />
    </>
  );
};

export default Rename;
