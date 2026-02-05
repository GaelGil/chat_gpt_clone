"use client";

import { Container, Text, Image, Input, Stack } from "@mantine/core";
import {
  createFileRoute,
  Link as RouterLink,
  redirect,
} from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";
import type { Body_login_login_access_token as AccessToken } from "@/client";
import { FiLock, FiMail } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { PasswordInput } from "@/components/ui/password-input";
import useAuth, { isLoggedIn } from "@/hooks/useAuth";
import Logo from "/assets/images/fastapi-logo.svg";
import { emailPattern, passwordRules } from "../../utils";

export const Route = createFileRoute("/auth/login")({
  component: Login,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});

function Login() {
  const { loginMutation, error, resetError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccessToken>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<AccessToken> = async (data) => {
    if (isSubmitting) return;

    resetError();

    try {
      console.log(data);
      await loginMutation.mutateAsync(data);
    } catch {
      // handled by useAuth
    }
  };

  return (
    <Container
      size="xs"
      justify-content="center"
      align-items="center"
      pt={"xl"}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <Stack pt={"xl"}>
          <Image src={Logo} alt="FastAPI logo" maw={120} mx="auto" />

          <Field errorText={errors.username?.message || !!error}>
            <InputGroup w="100%" startElement={<FiMail />}>
              <Input
                {...register("username", {
                  required: "Username is required",
                  pattern: emailPattern,
                })}
                placeholder="Email"
                type="email"
              />
            </InputGroup>
          </Field>

          <PasswordInput
            type="password"
            startElement={<FiLock />}
            {...register("password", passwordRules())}
            placeholder="Password"
            errors={errors}
          />

          <RouterLink
            to="/auth/recover-password"
            style={{ fontSize: "0.875rem" }}
          >
            Forgot Password?
          </RouterLink>
          <Button
            variant="solid"
            type="submit"
            loading={isSubmitting}
            size="md"
          >
            Log In
          </Button>

          <Text ta="center" size="sm">
            Don&apos;t have an account?{" "}
            <RouterLink
              to="/auth/signup"
              style={{ color: "var(--mantine-color-blue-filled)" }}
            >
              Sign Up
            </RouterLink>
          </Text>
        </Stack>
      </form>
    </Container>
  );
}
