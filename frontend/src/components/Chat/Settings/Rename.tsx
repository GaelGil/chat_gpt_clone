import { Box, Button, Flex, Input } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FiCheck, FiX } from "react-icons/fi"
import {
  SessionService,
  type SessionSimple,
  type UpdateSession,
} from "@/client"
import type { ApiError } from "@/client/core/ApiError"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"

interface ModelSelectionProps {
  session: SessionSimple
  onCancel: () => void
}

const Rename: React.FC<ModelSelectionProps> = ({ session, onCancel }) => {
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const deleteSession = async (data: UpdateSession) => {
    await SessionService.renameSession({
      sessionId: session.id,
      requestBody: data,
    })
  }

  const renameMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: (res: any) => {
      const message = res.message
      showSuccessToast(message)
    },
    onError: (err: ApiError) => {
      const body = err.body as { detail?: string } | undefined
      const message = body?.detail ?? "An error occurred"
      console.error(message)
      showErrorToast(message)
      handleError(err)
    },
    onSettled: () => {
      onCancel()
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
    },
  })

  const renamForm = useForm<UpdateSession>({
    initialValues: {
      title: session.title,
    },
    validateInputOnBlur: true,
    validate: {
      title: (value) =>
        value.length < 3 ? "Title must be at least 3 characters" : null,
    },
  })

  return (
    <Flex justify="space-between" align="center">
      <form
        onSubmit={renamForm.onSubmit((values) => {
          renameMutation.mutate(values)
        })}
      >
        <Input type="text" {...renamForm.getInputProps("title")} />
        <Box style={{ display: "flex", alignItems: "center" }}>
          <Button variant="transparent" type="submit">
            <FiCheck color="green" />
          </Button>
          <Button variant="transparent" onClick={() => onCancel()}>
            <FiX color="red" />
          </Button>
        </Box>
      </form>
    </Flex>
  )
}

export default Rename
