import PendingGenerations from "./PendingGenerations";
import { Stack, Title, Text, Box, Flex, Skeleton } from "@mantine/core";
import DeleteCanvas from "@/components/Canvas/DeleteCanvas";
import ClearCanvas from "@/components/Canvas/ClearCanvas";

function PendingCanvas() {
  return (
    <>
      <Box m={6}>
        <Flex justify="space-between" align="center">
          <Title order={2}>Canvas Images</Title>
          <Flex gap="sm">
            <DeleteCanvas id={""} />
            <ClearCanvas id={""} />
          </Flex>
        </Flex>
      </Box>

      <Box pos="relative">
        <PendingGenerations />

        <Stack gap={4}>
          <Text size="sm" c="dimmed">
            <Skeleton visible={true}>
              <strong>Canvas Name:</strong>
            </Skeleton>
          </Text>
        </Stack>
      </Box>
    </>
  );
}

export default PendingCanvas;
