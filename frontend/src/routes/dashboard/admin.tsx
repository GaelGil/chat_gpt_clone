"use client";

import {
  Badge,
  Container,
  Title,
  Table,
  Text,
  Group,
  Flex,
} from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { type UserPublic, UsersService } from "@/client";
import AddUser from "@/components/Admin/AddUser";
import { UserActionsMenu } from "@/components/Common/UserActionsMenu";
import PendingUsers from "@/components/Pending/PendingUsers";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";

const usersSearchSchema = z.object({
  page: z.number().catch(1),
});

const PER_PAGE = 5;

function getUsersQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      UsersService.readUsers({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["users", { page }],
  };
}

export const Route = createFileRoute("/dashboard/admin")({
  component: Admin,
  validateSearch: (search) => usersSearchSchema.parse(search),
});

function UsersTable() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);
  const navigate = useNavigate({ from: Route.fullPath });
  const { page = 1 } = Route.useSearch(); // default page = 1

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...getUsersQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  });

  const setPage = (page: number) => {
    navigate({
      to: "/dashboard/admin",
      search: (prev) => ({ ...prev, page }),
    });
  };

  const users = data?.data.slice(0, PER_PAGE) ?? [];
  const count = data?.count ?? 0;

  if (isLoading) {
    return <PendingUsers />;
  }

  return (
    <>
      <Table verticalSpacing="sm" highlightOnHover striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Full Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {users.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={5}>
                <Text c="dimmed">No users found</Text>
              </Table.Td>
            </Table.Tr>
          )}

          {users.map((user) => (
            <Table.Tr
              key={user.id}
              style={{ opacity: isPlaceholderData ? 0.5 : 1 }}
            >
              <Table.Td>
                <Group
                  gap={4}
                  style={{ display: "inline-flex", alignItems: "center" }}
                >
                  <span style={{ color: !user.full_name ? "gray" : "inherit" }}>
                    {user.full_name || "N/A"}
                  </span>
                  {currentUser?.id === user.id && (
                    <Badge color="teal" variant="filled" size="xs">
                      You
                    </Badge>
                  )}
                </Group>
              </Table.Td>

              <Table.Td>{user.email}</Table.Td>
              <Table.Td>{user.is_superuser ? "Superuser" : "User"}</Table.Td>
              <Table.Td>{user.is_active ? "Active" : "Inactive"}</Table.Td>
              <Table.Td>
                <UserActionsMenu
                  user={user}
                  disabled={currentUser?.id === user.id}
                />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Flex mt={4} justify="center">
        <PaginationRoot
          page={page}
          totalPages={Math.ceil(count / PER_PAGE)}
          count={count}
          pageSize={PER_PAGE}
          onPageChange={(newPage) => setPage(newPage)}
        >
          <Flex gap="sm" align="center">
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </Flex>
        </PaginationRoot>
      </Flex>
    </>
  );
}

function Admin() {
  return (
    <Container maw="full">
      <Title size="lg" pt={12} mb={12}>
        Users Management
      </Title>

      <AddUser />
      <UsersTable />
    </Container>
  );
}
