"use client";

import { Container, Text, Image, Input, Stack } from "@mantine/core";
import {
  createFileRoute,
  Link as RouterLink,
  redirect,
} from "@tanstack/react-router";
import { FiLock, FiUser } from "react-icons/fi";

import type { UserRegister } from "@/client";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { PasswordInput } from "@/components/ui/password-input";
import useAuth, { isLoggedIn } from "@/hooks/useAuth";
import { confirmPasswordRules, emailPattern, passwordRules } from "@/utils";
import Logo from "/assets/images/fastapi-logo.svg";

import { useForm } from "@mantine/form";

export const Route = createFileRoute("/auth/signup")({
  component: SignUp,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      });
    }
  },
});

interface UserRegisterForm extends UserRegister {
  confirm_password: string;
}

function SignUp() {
  const { signUpMutation } = useAuth();

  // Build Mantine form and re-use your emailPattern and helpers
  const form = useForm<UserRegisterForm>({
    // validate on blur to mimic react-hook-form's mode: "onBlur"
    validateInputOnBlur: true,
    initialValues: {
      email: "",
      full_name: "",
      password: "",
      confirm_password: "",
    },
    validate: {
      full_name: (value) => {
        if (!value || value.trim().length < 3) return "Full Name is required";
        return null;
      },

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

  // Convert Mantine errors into react-hook-form-like shape (so your custom components keep working)
  const rhfErrors: Record<string, any> = {
    full_name: form.errors.full_name
      ? { message: form.errors.full_name }
      : undefined,
    email: form.errors.email ? { message: form.errors.email } : undefined,
    password: form.errors.password
      ? { message: form.errors.password }
      : undefined,
    confirm_password: form.errors.confirm_password
      ? { message: form.errors.confirm_password }
      : undefined,
  };

  const handleSubmit = (values: UserRegisterForm) => {
    signUpMutation.mutate(values);
  };

  return (
    <Container
      size="xs"
      justify-content="center"
      align-items="center"
      pt={"xl"}
    >
      <form onSubmit={form.onSubmit(handleSubmit)} style={{ width: "100%" }}>
        <Stack pt={"xl"}>
          <Image src={Logo} alt="FastAPI logo" maw={120} mx="auto" />
          <Field errorText={rhfErrors.full_name?.message}>
            <InputGroup w="100%" startElement={<FiUser />}>
              <Input
                minLength={3}
                placeholder="Full Name"
                type="text"
                key={form.key("full_name")}
                {...form.getInputProps("full_name")}
              />
            </InputGroup>
          </Field>

          <Field errorText={rhfErrors.email?.message}>
            <InputGroup w="100%" startElement={<FiUser />}>
              <Input
                placeholder="Email"
                type="email"
                key={form.key("email")}
                {...form.getInputProps("email")}
              />
            </InputGroup>
          </Field>

          <PasswordInput
            type="password"
            startElement={<FiLock />}
            placeholder="Password"
            key={form.key("password")}
            {...form.getInputProps("password")}
            errors={rhfErrors}
          />

          <PasswordInput
            type="confirm_password"
            startElement={<FiLock />}
            placeholder="Confirm Password"
            key={form.key("confirm_password")}
            {...form.getInputProps("confirm_password")}
            errors={rhfErrors}
          />

          <Button
            variant="solid"
            loading={signUpMutation.isPending}
            size="md"
            type="submit"
          >
            Sign Up
          </Button>

          <Text>
            Already have an account?{" "}
            <RouterLink
              to="/auth/login"
              style={{ color: "var(--mantine-color-blue-filled)" }}
            >
              Log In
            </RouterLink>
          </Text>
        </Stack>
      </form>
    </Container>
  );
}

export default SignUp;
