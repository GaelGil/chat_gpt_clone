import { useQuery } from "@tanstack/react-query";
import { GenerationData, GenerationService } from "@/client";
import { createFileRoute } from "@tanstack/react-router";
import {
  Container,
  Stack,
  Title,
  Text,
  Paper,
  Divider,
  Image,
  SimpleGrid,
  Card,
  Group,
  Indicator,
  Flex,
} from "@mantine/core";

export const Route = createFileRoute("/generation/$generationId")({
  component: GenerationDetail,
});

function GenerationDetail() {
  const { generationId } = Route.useParams();
  const {
    data: generation,
    isLoading,
    error,
  } = useQuery<GenerationData>({
    queryKey: ["generation", generationId],
    queryFn: () => GenerationService.readGeneration({ id: generationId }), // Make sure this exists in your client
  });

  const statusColorMap = {
    pending: "yellow",
    failed: "red",
    completed: "green",
  } as const;
  if (isLoading) return <p>Loading generation details...</p>;
  if (error) return <p>Error loading details.</p>;
  if (!generation) return <p>Canvas not found.</p>;
  return (
    <Container size="md" py="xl">
      <Paper radius="md" p="xl">
        <Stack gap="lg">
          <Flex justify="space-between" align="center">
            <Title fw={700} size="xl" pt={12}>
              <Title order={2}> {generation.prompt}</Title>
            </Title>
            {/* <DeleteGeneration id={generation.id} /> */}
          </Flex>
          <Group align="center" gap="xs">
            <Indicator
              size={10}
              color={statusColorMap[generation.status]}
              inline
              {...(generation.status === "pending" ? { processing: true } : {})} // Set processing to true for pending status
            />
            <Text size="sm" c="dimmed" fw={500}>
              {generation.status}
            </Text>
          </Group>
          <SimpleGrid cols={3}>
            {generation.images?.map((imageItem, index: number) => (
              <Card
                key={index}
                shadow="xl"
                p="md"
                bd={"1px solid main.5"}
                radius="md"
                withBorder
                w={"100%"}
              >
                <Card.Section>
                  <Image
                    src={`${imageItem.image_url}`}
                    alt={generation.prompt || "image generation"}
                  />
                </Card.Section>
              </Card>
            ))}
          </SimpleGrid>

          <Divider my="sm" />

          <Stack gap={4}>
            <Text size="lg">
              <strong>Prompt:</strong> {generation.prompt || "No prompt"}
            </Text>
            <Text size="sm" c="dimmed">
              <strong>Created With:</strong> {generation.provider}
            </Text>
            <Text size="sm" c="dimmed">
              <strong>Canvas ID:</strong> {generation.id}
            </Text>
            <Text size="sm" c="dimmed">
              <strong>Created At:</strong> {generation.created_at}
            </Text>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}

export default GenerationDetail;
