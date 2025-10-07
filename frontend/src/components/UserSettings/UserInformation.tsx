"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  Container,
  Text,
  TextInput,
  Button,
  Stack,
  Group,
  Title,
} from "@mantine/core";

import {
  type ApiError,
  type UserPublic,
  UsersService,
  type UserUpdateMe,
} from "@/client";
import useAuth from "@/hooks/useAuth";
import useCustomToast from "@/hooks/useCustomToast";
import { emailPattern, handleError } from "@/utils";

const UserInformation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast } = useCustomToast();
  const [editMode, setEditMode] = useState(false);
  const { user: currentUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<UserPublic>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      full_name: currentUser?.full_name,
      email: currentUser?.email,
    },
  });

  const toggleEditMode = () => setEditMode(!editMode);

  const mutation = useMutation({
    mutationFn: (data: UserUpdateMe) =>
      UsersService.updateUserMe({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("User updated successfully.");
      toggleEditMode();
    },
    onError: (err: ApiError) => handleError(err),
    onSettled: () => queryClient.invalidateQueries(),
  });

  const onSubmit: SubmitHandler<UserUpdateMe> = (data) => mutation.mutate(data);

  const onCancel = () => {
    reset();
    toggleEditMode();
  };

  return (
    <Container size="xl" px="md">
      <Title order={4} py="md">
        User Information
      </Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md" maw={400}>
          {/* Full Name */}
          <Text size="md" fw={700}>
            Full name
          </Text>
          {editMode ? (
            <TextInput {...register("full_name", { maxLength: 30 })} />
          ) : (
            <Text size="md" c={!currentUser?.full_name ? "dimmed" : undefined}>
              {currentUser?.full_name || "N/A"}
            </Text>
          )}

          {/* Email */}
          <Text size="md" fw={700}>
            Email
          </Text>
          {editMode ? (
            <TextInput
              {...register("email", {
                required: "Email is required",
                pattern: emailPattern,
              })}
              error={errors.email?.message}
            />
          ) : (
            <Text size="md">{currentUser?.email || "N/A"}</Text>
          )}

          {/* Action Buttons */}
          <Group gap="sm" mt="sm">
            <Button
              type={editMode ? "submit" : "button"}
              onClick={editMode ? undefined : toggleEditMode}
              loading={editMode ? isSubmitting : false}
              disabled={editMode ? !isDirty || !getValues("email") : false}
            >
              {editMode ? "Save" : "Edit"}
            </Button>
            {editMode && (
              <Button
                variant="outline"
                color="gray"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </Group>
        </Stack>
      </form>
    </Container>
  );
};

export default UserInformation;
