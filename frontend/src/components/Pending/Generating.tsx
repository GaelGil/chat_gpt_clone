import { Text, Group, Indicator } from "@mantine/core";
import PendingImages from "./PendingImages";
import type { GenerationData } from "@/client";

const Generating = ({ generation }: { generation: GenerationData }) => {
  return (
    <>
      <Group align="center" gap="xs">
        <Text fw={800}>Prompt:</Text>
        <Text fw={500}>{generation?.prompt}</Text>
      </Group>
      <Group align="center" gap="xs">
        <Indicator size={10} color="yellow" inline processing />
        <Text size="sm" c="dimmed" fw={500}>
          pending
        </Text>
      </Group>

      <Text size="sm" c="dimmed" fw={500}>
        Created At:
      </Text>
      <Text size="sm" c="dimmed" fw={500}>
        Generated with: {generation?.provider}
      </Text>
      <Text size="sm" c="dimmed" fw={500}>
        Model: {generation?.model}
      </Text>
      <Text size="sm" c="dimmed" fw={500}>
        Request sent at: {generation?.created_at}
      </Text>
      <PendingImages numImages={Number(generation?.num_images) || 5} />
    </>
  );
};
export default Generating;
