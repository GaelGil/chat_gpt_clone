import { Card, Text, Group, Indicator } from "@mantine/core";
import type { GenerationData } from "@/client";
import Generating from "../Pending/Generating";
import Images from "./Images";
type CanvasGenerationsProps = {
  generations: GenerationData[];
};

const CanvasGenerations = ({ generations }: CanvasGenerationsProps) => {
  return (
    <>
      {generations?.map((generation) => (
        <Card key={generation.id} bg={"transparent"}>
          {generation.status === "pending" ? (
            <Generating generation={generation} />
          ) : (
            <>
              <Group align="center" gap="xs">
                <Text fw={800}>Prompt:</Text>
                <Text fw={500}>{generation.prompt}</Text>
              </Group>
              <Group align="center" gap="xs">
                <Indicator size={10} color="green" inline />
                <Text size="sm" c="dimmed" fw={500}>
                  {generation.status}
                </Text>
              </Group>
              <Text size="sm" c="dimmed" fw={500}>
                Created At: {generation.created_at}
              </Text>
              <Text size="sm" c="dimmed" fw={500}>
                Generated with: {generation.provider}
              </Text>
              <Text size="sm" c="dimmed" fw={500}>
                Model: {generation.provider}
              </Text>
              <Images images={generation.images} />
            </>
          )}
        </Card>
      ))}
    </>
  );
};

export default CanvasGenerations;
