import { Text } from "@mantine/core";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "@tanstack/react-router";

import {
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogBody,
  DialogFooter,
  // DialogActionTrigger,
} from "@/components/ui/dialog";
import { CanvasService } from "@/client";
import useCustomToast from "@/hooks/useCustomToast";

const DeleteCanvas = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const { handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;
  const navigate = useNavigate();

  const deleteCanvas = async (id: string) => {
    await CanvasService.deleteCanvas({ id: id });
  };

  const mutation = useMutation({
    mutationFn: deleteCanvas,
    onSuccess: () => {
      showSuccessToast("The user was deleted successfully");
      setIsOpen(false);
      navigate({ to: "/dashboard" });
    },
    onError: () => {
      showErrorToast("An error occurred while deleting the user");
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
        c="red"
        size="sm"
        onClick={() => setIsOpen(true)}
        leftSection={<FiTrash2 />}
      >
        Delete Canvas
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
              Canvas and its history will be{" "}
              <strong>permanently deleted.</strong> Are you sure? You will not
              be able to undo this action.
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
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </>
  );
};

export default DeleteCanvas;
