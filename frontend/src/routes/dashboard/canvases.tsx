import {
  Container,
  Flex,
  Center,
  Title,
  Stack,
  SimpleGrid,
  Card,
  Image,
  Text,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { z } from "zod";
import { CanvasService } from "@/client";
import PendingCanvas from "@/components/Pending/PendingCanvases";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination.tsx";
import { LOGO } from "@/const";
import AddCanvas from "@/components/Canvas/AddCanvas";

const PER_PAGE = 5;

function getItemsQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      CanvasService.readCanvases({
        skip: (page - 1) * PER_PAGE,
        limit: PER_PAGE,
      }),
    queryKey: ["items", { page }],
  };
}

const itemsSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/dashboard/canvases")({
  component: Canvas,
  validateSearch: (search) => itemsSearchSchema.parse(search),
});

function Canvases() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page } = Route.useSearch();

  const { data, isLoading, isError } = useQuery({
    ...getItemsQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  });

  const setPage = (page: number) => {
    navigate({
      to: "/dashboard/canvases",
      search: (prev) => ({ ...prev, page }),
    });
  };

  const canvases = data?.data.slice(0, PER_PAGE) ?? [];
  const count = data?.count ?? 0;

  if (isLoading) {
    return <PendingCanvas />;
  }

  if (isError) {
    return <p>Error loading canvases.</p>;
  }

  if (canvases.length === 0) {
    return (
      <Container py="xl" size="md">
        <Center style={{ minHeight: "50vh" }}>
          <Stack align="center" gap="xs" mt="md">
            <Title order={3}>You don't have any canvases</Title>
            <Text c="dimmed">Create a new one to get started</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <>
      <SimpleGrid cols={3} mt={"xl"} p={"xl"}>
        {canvases.map((canvas) => (
          <Card
            key={canvas.id}
            shadow="xl"
            p="md"
            bd={"1px solid main.5"}
            radius="md"
            withBorder
            w={"100%"}
          >
            <Link
              key={canvas.id}
              to="/canvas/$canvasId"
              params={{ canvasId: canvas.id }}
            >
              <Card.Section>
                <Image src={LOGO} alt={canvas.id} />

                <Text fw={500}>{canvas.title}</Text>
              </Card.Section>
            </Link>
          </Card>
        ))}
      </SimpleGrid>

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

function Canvas() {
  return (
    <Container mah="full">
      <Flex justify="space-between" align="center">
        <Title fw={700} size="xl" pt={12}>
          Canvas Management
        </Title>
        <AddCanvas />
      </Flex>
      <Canvases />
    </Container>
  );
}
