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
    return (
      <Text c="#b4b4b4" fz="sm" px="sm">
        Loading…
      </Text>
    )
  }

  if (isError) {
    return (
      <Text c="#ececec" fz="sm" px="sm" role="alert">
        Unable to Load Chats. Try Again.
      </Text>
    )
  }

  const sessions = data?.sessions ?? []

  if (sessions.length === 0) {
    return (
      <Text c="#b4b4b4" fz="sm" px="sm">
        Start a New Chat
      </Text>
    )
  }

  return (
    <Stack gap={2} style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
      {sessions.map((session) => (
        <Flex
          key={session.id}
          align="center"
          justify="space-between"
          gap={4}
          px="sm"
          py={6}
          bdrs="md"
          onMouseEnter={() => setHoveredId(session.id)}
          onMouseLeave={() => setHoveredId(null)}
          onFocus={() => setHoveredId(session.id)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setHoveredId(null)
            }
          }}
          style={{
            background: hoveredId === session.id ? "#2f2f2f" : "transparent",
            minHeight: 36,
          }}
        >
          {editId === session.id ? (
            <Rename session={session} onCancel={() => setEditId(null)} />
          ) : (
            <Link
              to="/chat/$chatId"
              params={{ chatId: session.id.toString() }}
              style={{
                color: "#ececec",
                flex: 1,
                minWidth: 0,
                textDecoration: "none",
              }}
            >
              <Text fz="sm" truncate>
                {session.title}
              </Text>
            </Link>
          )}

          {hoveredId === session.id && (
            <Menu position="bottom-end" withinPortal>
              <Menu.Target>
                <Button
                  aria-label="Open Chat Actions"
                  type="button"
                  variant="transparent"
                  size="xs"
                  px={6}
                  c="#b4b4b4"
                >
                  <FiMoreHorizontal aria-hidden="true" />
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<FiEdit2 size={14} aria-hidden="true" />}
                  onClick={() => setEditId(session.id)}
                >
                  Rename
                </Menu.Item>

                <Menu.Item
                  color="red"
                  leftSection={<FiTrash2 aria-hidden="true" />}
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
