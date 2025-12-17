import { Button, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiTrash2 } from "react-icons/fi";

import { SessionService } from "@/client";
import {
  DialogContent,
  DialogCloseTrigger,
  DialogTitle,
  DialogHeader,
  DialogBody,
  DialogFooter,
  // DialogActionTrigger,
} from "@/components/ui/dialog";
import useCustomToast from "@/hooks/useCustomToast";

const DeleteSession = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const { handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const deleteSession = async (id: string) => {
    await SessionService.deleteSession({ sessionId: id });
  };

  const mutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      showSuccessToast("The user was deleted successfully");
      setIsOpen(false);
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
        variant="subtle"
        color="red"
        size="sm"
        onClick={() => setIsOpen(true)}
        leftSection={<FiTrash2 />}
      >
        Delete
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
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>

          <DialogBody>
            <Text mb="md">
              All items associated with this user will also be{" "}
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
        <DialogCloseTrigger />
      </DialogContent>
    </>
  );
};

export default DeleteSession;
