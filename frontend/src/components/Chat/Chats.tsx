import { SessionService } from "@/client";
import { useQuery } from "@tanstack/react-query";
import { Menu, Button, Stack, Flex, Text } from "@mantine/core";
import { FiMoreHorizontal, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Link } from "@tanstack/react-router";

import DeleteSession from "./Delete";
import { useState } from "react";
function getUsersQueryOptions() {
  return {
    queryFn: () => SessionService.getSessions(),
    queryKey: ["sessions"],
  };
}
const Chats = () => {
  // const sessions;
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
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

  return (
    <Stack>
      {sessions.map((item) => (
        <Flex
          key={item.id}
          align="center"
          justify="space-between"
          onMouseEnter={() => setHoveredId(item.id)}
          // onMouseLeave={() => setHoveredId(null)}
        >
          <Link
            to="/chat/$chatId"
            params={{ chatId: item.id.toString() }}
            style={{ textDecoration: "none" }}
          >
            <Text fz="sm">{item.title}</Text>
          </Link>

          <Button variant="transparent" size="xs" px={6}></Button>
          {hoveredId === item.id && (
            <Menu position="bottom-end" withinPortal>
              <Menu.Target>
                <Button variant="transparent" size="xs" px={6}>
                  <FiMoreHorizontal />
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item leftSection={<FiEdit2 size={14} />}>
                  Rename
                </Menu.Item>

                <Menu.Item
                  color="red"
                  leftSection={<FiTrash2 />}
                  onClick={() => setDeleteId(item.id)}
                ></Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
          {deleteId === item.id && (
            <DeleteSession id={deleteId} opened={true} />
          )}
        </Flex>
      ))}
    </Stack>
  );
};

export default Chats;
