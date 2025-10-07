"use client";

import { Button, Stack, Group, Input } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { type NewCanvasRequest, CanvasService } from "@/client";
import type { ApiError } from "@/client/core/ApiError";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";
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

const AddCanvas = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useCustomToast();

  const form = useForm<NewCanvasRequest>({
    validateInputOnBlur: true,
    initialValues: {
      title: "",
    },
    validate: {
      title: (value) => (value?.trim() !== "" ? null : "Title is required"),
    },
  });

  const mutation = useMutation({
    mutationFn: (data: NewCanvasRequest) =>
      CanvasService.createCanvas({ requestBody: data }),
    onSuccess: () => {
      console.log("Canvas created successfully.");
      showSuccessToast("Canvas created successfully.");
      form.reset();
      setIsOpen(false);
    },
    onError: (err: ApiError) => {
      console.error(err);
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
        New Canvas
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
            <DialogTitle>Create a new Canvas</DialogTitle>
            <DialogCloseTrigger onClick={() => setIsOpen(false)} />
          </DialogHeader>

          <DialogBody>
            <Stack gap="sm">
              <Field errorText={form.errors.title} label="Title">
                <InputGroup>
                  <Input
                    placeholder="Enter a title for the canvas"
                    key={form.key("title")}
                    {...form.getInputProps("title")}
                  />
                </InputGroup>
              </Field>
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
                Create Canvas
              </Button>
            </Group>
          </DialogFooter>
        </form>
      </DialogContent>
    </>
  );
};

export default AddCanvas;
