import { useQuery } from "@tanstack/react-query";
import { CanvasData, CanvasService } from "@/client";
import { createFileRoute } from "@tanstack/react-router";
import { Stack, Title, Text, Box, Flex } from "@mantine/core";
import DeleteCanvas from "@/components/Canvas/DeleteCanvas";
import ClearCanvas from "@/components/Canvas/ClearCanvas";
import CanvasGenerations from "@/components/Canvas/Generations";
import AddToCanvas from "@/components/Canvas/AddToCanvas";
import PendingCanvas from "@/components/Pending/PendingCanvas";
export const Route = createFileRoute("/canvas/$canvasId")({
  component: CanvasDetail,
});

function CanvasDetail() {
  const { canvasId } = Route.useParams();

  const {
    data: canvas,
    isLoading,
    error,
  } = useQuery<CanvasData>({
    queryKey: ["canvas", canvasId],
    queryFn: () => CanvasService.readCanvas({ id: canvasId }), // Make sure this exists in your client
  });

  if (isLoading) return <PendingCanvas />;
  if (error) return <p>Error loading canvas.</p>;
  if (!canvas) return <p>Canvas not found.</p>;
  return (
    <>
      <Box m={6}>
        <Flex justify="space-between" align="center">
          <Title order={2}>Canvas Images</Title>
          <Flex gap="sm">
            <DeleteCanvas id={canvas.id} />
            <ClearCanvas id={canvas.id} />
          </Flex>
        </Flex>
      </Box>

      <Box pos="relative">
        <CanvasGenerations generations={canvas.generations} />
        <AddToCanvas id={canvas.id} />

        <Stack gap={4}>
          <Text size="sm" c="dimmed">
            <strong>Canvas ID:</strong> {canvas.id}
          </Text>
          <Text size="sm" c="dimmed">
            <strong>Created At:</strong> {canvas.created_at}
          </Text>
        </Stack>
      </Box>
    </>
  );
}
