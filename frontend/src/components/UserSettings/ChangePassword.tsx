"use client";

import { Box, Button, Container, Title, Stack, Group } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";
import { FiLock } from "react-icons/fi";

import { type ApiError, type UpdatePassword, UsersService } from "@/client";
import useCustomToast from "@/hooks/useCustomToast";
import { confirmPasswordRules, handleError, passwordRules } from "@/utils";
import { PasswordInput } from "../ui/password-input";

interface UpdatePasswordForm extends UpdatePassword {
  confirm_password: string;
}

const ChangePassword = () => {
  const { showSuccessToast } = useCustomToast();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordForm>({
    mode: "onBlur",
    criteriaMode: "all",
  });

  const mutation = useMutation({
    mutationFn: (data: UpdatePassword) =>
      UsersService.updatePasswordMe({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Password updated successfully.");
      reset();
    },
    onError: (err: ApiError) => {
      handleError(err);
    },
  });

  const onSubmit: SubmitHandler<UpdatePasswordForm> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <Container size="xl" px="md">
      <Title order={4} py="md">
        Change Password
      </Title>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: "100%", maxWidth: 400 }}
      >
        <Stack gap="sm">
          <PasswordInput
            type="current_password"
            startElement={<FiLock />}
            {...register("current_password", passwordRules())}
            placeholder="Current Password"
            errors={errors}
          />
          <PasswordInput
            type="new_password"
            startElement={<FiLock />}
            {...register("new_password", passwordRules())}
            placeholder="New Password"
            errors={errors}
          />
          <PasswordInput
            type="confirm_password"
            startElement={<FiLock />}
            {...register("confirm_password", confirmPasswordRules(getValues))}
            placeholder="Confirm Password"
            errors={errors}
          />
        </Stack>
        <Group mt="md">
          <Button type="submit" loading={isSubmitting}>
            Save
          </Button>
        </Group>
      </Box>
    </Container>
  );
};

export default ChangePassword;
