import { Box, Button, Flex, Input } from "@mantine/core";
import { SessionSimple } from "@/client";
import { FiCheck, FiX } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleError } from "@/utils";
import type { ApiError } from "@/client/core/ApiError";
import { SessionService } from "@/client";

import useCustomToast from "@/hooks/useCustomToast";
interface ModelSelectionProps {
  item: SessionSimple;
  onCancel: () => void;
}

const Rename: React.FC<ModelSelectionProps> = ({ item, onCancel }) => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const deleteSession = async (id: string) => {
    await SessionService.renameSession({ sessionId: id });
  };

  const renameMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: (res: any) => {
      const message = res.message;
      onCancel();
      showSuccessToast(message);
    },
    onError: (err: ApiError) => {
      const body = err.body as { detail?: string } | undefined;
      const message = body?.detail ?? "An error occurred";
      console.error(message);
      showErrorToast(message);
      handleError(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  const onSubmit = async () => {
    renameMutation.mutate(item.id);
  };
  return (
    <Flex justify="space-between" align="center">
      <form onSubmit={onSubmit}>
        <Input type="text" defaultValue={item.title} />
        <Box style={{ display: "flex", alignItems: "center" }}>
          <Button variant="transparent" type="submit">
            <FiCheck color="green" />
          </Button>
          <Button variant="transparent" onClick={() => onCancel()}>
            <FiX color="red" />
          </Button>
        </Box>
      </form>
    </Flex>
  );
};

export default Rename;
