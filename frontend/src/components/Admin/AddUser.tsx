"use client";

import { Button, Text, Stack, Group, Input } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { type UserCreate, UsersService } from "@/client";
import type { ApiError } from "@/client/core/ApiError";
import useCustomToast from "@/hooks/useCustomToast";
import { Checkbox } from "../ui/checkbox";
import {
  handleError,
  emailPattern,
  passwordRules,
  confirmPasswordRules,
} from "@/utils";
import {
  DialogContent,
  DialogCloseTrigger,
  DialogTitle,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "../ui/dialog";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { PasswordInput } from "@/components/ui/password-input";
import { FiUser, FiLock } from "react-icons/fi";

interface UserCreateForm extends UserCreate {
  confirm_password: string;
}

const AddUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useCustomToast();

  const form = useForm<UserCreateForm>({
    validateInputOnBlur: true,
    initialValues: {
      email: "",
      full_name: "",
      password: "",
      confirm_password: "",
      is_superuser: false,
      is_active: false,
    },
    validate: {
      email: (value) =>
        emailPattern.value.test(value) ? null : emailPattern.message,
      password: (value) => {
        const rule = passwordRules();
        return value.length >= 8
          ? null
          : (rule.minLength?.message ??
              "Password must be at least 8 characters");
      },
      confirm_password: (value, values) => {
        const rule = confirmPasswordRules(() => values.password);
        return value === values.password
          ? null
          : (rule.validate?.(value, values) ?? "Passwords do not match");
      },
    },
  });

  const mutation = useMutation({
    mutationFn: (data: UserCreate) =>
      UsersService.createUser({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("User created successfully.");
      form.reset();
      setIsOpen(false);
    },
    onError: (err: ApiError) => {
      const body = err.body as { detail?: string } | undefined;
      const message = body?.detail ?? "An error occurred";
      showErrorToast(message);
      handleError(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return (
    <>
      <Button
        my="md"
        onClick={() => setIsOpen(true)}
        leftSection={<FaPlus size={18} />}
      >
        Add User
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
            <DialogTitle>Add User</DialogTitle>
            <DialogCloseTrigger onClick={() => setIsOpen(false)} />
          </DialogHeader>

          <DialogBody>
            <Text mb="sm">
              Fill in the form below to add a new user to the system.
            </Text>

            <Stack gap="sm">
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

export default AddUser;
