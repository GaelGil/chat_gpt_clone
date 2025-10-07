// EditUser.tsx
"use client";
import { useEffect } from "react";
import { Button, Text, Stack, Group, Input } from "@mantine/core";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type UserPublic, UsersService, type UserUpdate } from "@/client";
import { InputGroup } from "@/components/ui/input-group";
import { PasswordInput } from "@/components/ui/password-input";
import { Field } from "@/components/ui/field";
import type { ApiError } from "@/client/core/ApiError";
import { useForm } from "@mantine/form";
import useCustomToast from "@/hooks/useCustomToast";
import { FiUser, FiLock } from "react-icons/fi";
import {
  handleError,
  emailPattern,
  passwordRules,
  confirmPasswordRules,
} from "@/utils";

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface EditUserProps {
  user: UserPublic;
  open?: boolean;
  onClose?: () => void;
}

interface UserUpdateForm extends UserUpdate {
  confirm_password?: string;
}

const EditUser = ({ user }: EditUserProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showSuccessToast } = useCustomToast();

  // 🔹 Mantine form
  const form = useForm<UserUpdateForm>({
    validateInputOnBlur: true,
    initialValues: {
      email: user.email || "",
      full_name: user.full_name ?? "",
      password: "",
      confirm_password: "",
      is_superuser: user.is_superuser,
      is_active: user.is_active,
    },

    validate: {
      email: (value) =>
        emailPattern.value.test(value ?? "") ? null : emailPattern.message,
      password: (value) => {
        if (!value) return null;
        const rule = passwordRules();
        return value.length >= 8
          ? null
          : (rule.minLength?.message ??
              "Password must be at least 8 characters");
      },
      confirm_password: (value, values) => {
        if (!value && !values.password) return null;
        const rule = confirmPasswordRules(() => values.password ?? "");
        return value === values.password
          ? null
          : (rule.validate?.(value, values) ?? "Passwords do not match");
      },
    },
  });

  const mutation = useMutation({
    mutationFn: (data: UserUpdateForm) =>
      UsersService.updateUser({ userId: user.id, requestBody: data }),
    onSuccess: () => {
      showSuccessToast("User updated successfully.");
      setIsOpen(false);
      form.reset();
    },
    onError: (err: ApiError) => handleError(err),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
  useEffect(() => {
    console.log("EditUser mounted", user.id);
    return () => console.log("EditUser unmounted", user.id);
  }, [user.id]);

  useEffect(() => {
    console.log("isOpen state changed:", isOpen);
  }, [isOpen]);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="sm" variant="outline">
        Edit User
      </Button>

      <DialogContent
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        size="md"
        centered
        portalled
        style={{ padding: 20 }}
      >
        <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogCloseTrigger onClick={() => setIsOpen(false)} />
          </DialogHeader>

          <DialogBody>
            <Text mb="md">Update the user details below.</Text>

            <Stack gap="md">
              <Field errorText={form.errors.email}>
                <InputGroup w="100%" startElement={<FiUser />}>
                  <Input
                    placeholder="Email"
                    key={form.key("email")}
                    {...form.getInputProps("email")}
                  />
                </InputGroup>
              </Field>

              <Field errorText={form.errors.full_name}>
                <InputGroup w="100%" startElement={<FiUser />}>
                  <Input
                    placeholder="Full name"
                    key={form.key("full_name")}
                    {...form.getInputProps("full_name")}
                  />
                </InputGroup>
              </Field>

              <PasswordInput
                type="password"
                startElement={<FiLock />}
                key={form.key("password")}
                {...form.getInputProps("password")}
                placeholder="Password"
                errors={form.errors}
              />

              <PasswordInput
                type="password"
                startElement={<FiLock />}
                key={form.key("confirm_password")}
                {...form.getInputProps("confirm_password")}
                placeholder="Confirm Password"
                errors={form.errors}
              />

              <Checkbox
                mt="md"
                label="Is superuser?"
                key={form.key("is_superuser")}
                {...form.getInputProps("is_superuser", { type: "checkbox" })}
              />

              <Checkbox
                mt="md"
                label="Is active?"
                key={form.key("is_active")}
                {...form.getInputProps("is_active", { type: "checkbox" })}
              />
            </Stack>
          </DialogBody>

          <DialogFooter>
            <Group justify="flex-end" mt="md">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" loading={mutation.isPending}>
                Save
              </Button>
            </Group>
          </DialogFooter>
        </form>
      </DialogContent>
    </>
  );
};

export default EditUser;
