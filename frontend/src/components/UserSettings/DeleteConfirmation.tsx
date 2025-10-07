"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button, Group, Text, Modal, Stack } from "@mantine/core";

import { type ApiError, UsersService } from "@/client";
import useAuth from "@/hooks/useAuth";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";

const DeleteConfirmation = () => {
  const [opened, setOpened] = useState(false);
  const queryClient = useQueryClient();
  const { showSuccessToast } = useCustomToast();
  const { logout } = useAuth();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const mutation = useMutation({
    mutationFn: () => UsersService.deleteUserMe(),
    onSuccess: () => {
      showSuccessToast("Your account has been successfully deleted");
      setOpened(false);
      logout();
    },
    onError: (err: ApiError) => handleError(err),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
  });

  const onSubmit = async () => mutation.mutate();

  return (
    <>
      <Button color="red" onClick={() => setOpened(true)}>
        Delete
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Confirmation Required"
        size="sm"
        centered
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Text>
              All your account data will be{" "}
              <strong>permanently deleted.</strong> If you are sure, please
              click <strong>"Confirm"</strong> to proceed. This action cannot be
              undone.
            </Text>

            <Group gap="sm">
              <Button
                variant="outline"
                color="gray"
                onClick={() => setOpened(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button color="red" type="submit" loading={isSubmitting}>
                Delete
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default DeleteConfirmation;
