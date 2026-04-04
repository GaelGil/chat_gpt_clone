import { Button, Flex, Menu, Stack, Text } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { useState } from "react"
import { FiEdit2, FiMoreHorizontal, FiTrash2 } from "react-icons/fi"
import { SessionService } from "@/client"
import DeleteSession from "./Settings/Delete"
import Rename from "./Settings/Rename"

function getUsersQueryOptions() {
  return {
    queryFn: () => SessionService.getSessions(),
    queryKey: ["sessions"],
  }
}
const Chats = () => {
  // const sessions;
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const { data, isLoading, isError } = useQuery({
    ...getUsersQueryOptions(),
    placeholderData: (prevData) => prevData,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error</div>
  }

  const sessions = data?.sessions ?? []

  if (sessions.length === 0) {
    return <Text>Start a new chat!</Text>
  }

  return (
    <Stack>
      {sessions.map((session) => (
        <Flex
          key={session.id}
          align="center"
          justify="space-between"
          onMouseEnter={() => setHoveredId(session.id)}
        >
          {editId === session.id ? (
            <Rename session={session} onCancel={() => setEditId(null)} />
          ) : (
            <Link
              to="/chat/$chatId"
              params={{ chatId: session.id.toString() }}
              style={{ textDecoration: "none" }}
            >
              <Text fz="sm">{session.title}</Text>
            </Link>
          )}

          <Button variant="transparent" size="xs" px={6} />
          {hoveredId === session.id && (
            <Menu position="bottom-end" withinPortal>
              <Menu.Target>
                <Button variant="transparent" size="xs" px={6}>
                  <FiMoreHorizontal />
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<FiEdit2 size={14} />}
                  onClick={() => setEditId(session.id)}
                >
                  Rename
                </Menu.Item>

                <Menu.Item
                  color="red"
                  leftSection={<FiTrash2 />}
                  onClick={() => setDeleteId(session.id)}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
          {deleteId === session.id && (
            <DeleteSession id={deleteId} opened={true} />
          )}
        </Flex>
      ))}
    </Stack>
  )
}

export default Chats
