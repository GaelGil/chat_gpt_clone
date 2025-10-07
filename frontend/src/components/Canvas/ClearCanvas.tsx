import { Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FaBroom } from "react-icons/fa";
import {
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { CanvasService } from "@/client";
import useCustomToast from "@/hooks/useCustomToast";

const ClearCanvas = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const { handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const deleteCanvas = async (id: string) => {
    await CanvasService.deleteCanvas({ id: id });
  };

  const mutation = useMutation({
    mutationFn: deleteCanvas,
    onSuccess: () => {
      showSuccessToast("The Canvas was cleared successfully");
      setIsOpen(false);
    },
    onError: () => {
      showErrorToast("An error occurred while clearing the canvas");
    },
    onSettled: () => {
      queryClient.invalidateQueries();
    },
  });

  const onSubmit = async () => {
    mutation.mutate(id);
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        color="transparent"
        c="white"
        onClick={() => setIsOpen(true)}
        leftSection={<FaBroom />}
      >
        Clear
      </Button>

      <DialogContent
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        size="md"
        centered
        portalled
        style={{ padding: 20 }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Delete Canvas</DialogTitle>
          </DialogHeader>

          <DialogBody>
            <Text mb="md">
              The current images in the canvas will be be cleared leaving the
              canvas empty. Are you sure? You will still be able to view in
              history
            </Text>
          </DialogBody>

          <DialogFooter>
            <Button
              variant="outline"
              color="gray"
              disabled={isSubmitting}
              onClick={() => setIsOpen(false)} // manually close the modal
            >
              Cancel
            </Button>

            <Button
              variant="outline"
              color="red"
              type="submit"
              loading={isSubmitting}
            >
              Clear
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </>
  );
};

export default ClearCanvas;
