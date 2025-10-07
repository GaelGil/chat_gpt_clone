import { Container, Text, Input, Title } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";
import { FiMail } from "react-icons/fi";

import { type ApiError, LoginService } from "@/client";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { isLoggedIn } from "@/hooks/useAuth";
import useCustomToast from "@/hooks/useCustomToast";
import { emailPattern, handleError } from "@/utils";

interface FormData {
  email: string;
}

export const Route = createFileRoute("/auth/recover-password")({
  component: RecoverPassword,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function RecoverPassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const { showSuccessToast } = useCustomToast();

  const recoverPassword = async (data: FormData) => {
    await LoginService.recoverPassword({
      email: data.email,
    });
  };

  const mutation = useMutation({
    mutationFn: recoverPassword,
    onSuccess: () => {
      showSuccessToast("Password recovery email sent successfully.");
      reset();
    },
    onError: (err: ApiError) => {
      handleError(err);
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <Container
      size="xs"
      h="100vh"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <Title size="xl" mb={2}>
          Password Recovery
        </Title>
        <Text>
          A password recovery email will be sent to the registered account.
        </Text>
        <Field errorText={errors.email?.message}>
          <InputGroup w="100%" startElement={<FiMail />}>
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: emailPattern,
              })}
              placeholder="Email"
              type="email"
            />
          </InputGroup>
        </Field>
        <Button variant="solid" loading={isSubmitting}>
          Continue
        </Button>
      </form>
    </Container>
  );
}
