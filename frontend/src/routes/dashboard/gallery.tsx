import {
  SimpleGrid,
  Flex,
  Image,
  Box,
  Title,
  Text,
  Container,
} from "@mantine/core";
// import { Link } from "@tanstack/react-router";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { GenerationService } from "@/client";
import { z } from "zod";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination.tsx";
import PendingGallery from "@/components/Pending/PendingGallery";

const PER_PAGE = 15;

function getItemsQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      GenerationService.readImages({
        skip: (page - 1) * PER_PAGE,
        limit: PER_PAGE,
      }),
    queryKey: ["items", { page }],
  };
}

const itemsSearchSchema = z.object({
  page: z.number().catch(1),
});
export const Route = createFileRoute("/dashboard/gallery")({
  component: Gallery,
  validateSearch: (search) => itemsSearchSchema.parse(search),
});

function Images() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page } = Route.useSearch();

  const { data, isLoading, isError } = useQuery({
    ...getItemsQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  });

  const setPage = (page: number) => {
    navigate({
      to: "/dashboard/gallery",
      search: (prev) => ({ ...prev, page }),
    });
  };

  const count = data?.count ?? 0;

  if (isLoading) {
    return <PendingGallery />;
  }

  if (isError) {
    return (
      <Container py="xl" size="md">
        <Box pos="relative">
          <Text size="sm" c="dimmed" fw={500}>
            No images found
          </Text>
        </Box>
      </Container>
    );
  }

  if (data?.data.length === 0) {
    return (
      <Container py="xl" size="md">
        <Box pos="relative">
          <Text size="sm" c="dimmed" fw={500}>
            No images found
          </Text>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <SimpleGrid cols={5} spacing={"1px"}>
        {data?.data.map((image) => (
          // <Link
          //   key={image.id}
          //   to="/generation/$generationId"
          //   params={{ generationId: image.id }}
          // >
          <Box pos="relative">
            <Image
              src={image.image_url}
              alt="Image"
              radius="sm"
              bd={"1px solid grey"}
            />
          </Box>
          // </Link>
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

function Gallery() {
  return (
    <>
      <Container mah="full">
        <Flex justify="space-between" align="center">
          <Title fw={700} size="xl" pt={12}>
            Gallery
          </Title>
        </Flex>
        <Images />
      </Container>
    </>
  );
}
