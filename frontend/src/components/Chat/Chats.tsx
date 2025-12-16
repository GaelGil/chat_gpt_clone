import { SessionService } from "@/client";
import { useQuery } from "@tanstack/react-query";
import { Menu, Button, Stack, Flex, Text } from "@mantine/core";
import { FiMoreHorizontal, FiEdit2, FiTrash } from "react-icons/fi";
import { Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";
import type { ApiError } from "@/client/core/ApiError";
function getUsersQueryOptions() {
  return {
    queryFn: () => SessionService.getSessions(),
    queryKey: ["sessions"],
  };
}
const Chats = () => {
  // const sessions;
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useCustomToast();

  const { data, isLoading, isError } = useQuery({
    ...getUsersQueryOptions(),
    placeholderData: (prevData) => prevData,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const sessions = data?.sessions ?? [];

  if (sessions.length === 0) {
    return <Text>Start a new chat!</Text>;
  }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => SessionService.deleteSession({ sessionId: id }),
    onSuccess: (res: any) => {
      const message = res.message;
      showSuccessToast(message);
    },
    onError: (err: ApiError) => {
      const body = err.body as { detail?: string } | undefined;
      const message = body?.detail ?? "An error occurred";
      console.error(message);
      showErrorToast(message);
      handleError(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  return (
    <Stack>
      {sessions.map((item) => (
        <Flex mb="sm">
          <Link
            to="/chat/$chatId"
            params={{ chatId: item.id.toString() }}
            key={item.id}
          >
            <Text fz={"sm"}>{item.title}</Text>
          </Link>
          <Menu position="bottom-end" withinPortal shadow="md">
            <Menu.Target>
              <Button variant="subtle" size="xs" px={6}>
                <FiMoreHorizontal />
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item icon={<FiEdit2 size={14} />}>Rename</Menu.Item>

              <Menu.Item
                color="red"
                icon={<FiTrash size={14} />}
                onClick={() => deleteMutation}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      ))}
    </Stack>
  );
};

export default Chats;
