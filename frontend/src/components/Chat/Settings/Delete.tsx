import { Button, Group, Text } from "@mantine/core"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { SessionService } from "@/client"
import type { ApiError } from "@/client/core/ApiError"
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"

const DeleteSession = ({ id, opened }: { id: string; opened: boolean }) => {
  const [isOpen, setIsOpen] = useState(opened)
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const { handleSubmit, formState } = useForm()
  const { isSubmitting } = formState

  const deleteSession = async (id: string) => {
    await SessionService.deleteSession({ sessionId: id })
  }

  const deleteMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: (res: any) => {
      const message = res.message
      showSuccessToast(message)
      setIsOpen(false)
    },
    onError: (err: ApiError) => {
      const body = err.body as { detail?: string } | undefined
      const message = body?.detail ?? "An error occurred"
      console.error(message)
      showErrorToast(message)
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
    },
  })

  const onSubmit = async () => {
    deleteMutation.mutate(id)
  }

  return (
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
          <DialogTitle>Delete Session</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <Text mb="md">All messages in this session will be deleted.</Text>
        </DialogBody>

        <DialogFooter>
          <Group gap="md">
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
          </Group>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

export default DeleteSession
