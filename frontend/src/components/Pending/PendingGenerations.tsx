"use client";

import { SimpleGrid, Card, Image, Skeleton } from "@mantine/core";
import { SkeletonText } from "../ui/skeleton";

const PendingGenerations = () => (
  <SimpleGrid cols={3}>
    {[...Array(5)].map((_, index) => (
      <Card
        key={index}
        shadow="xl"
        p="md"
        bd={"1px solid main.5"}
        radius="md"
        withBorder
        w={"100%"}
      >
        <Card.Section>
          <Skeleton visible={true}>
            <Image h={200} src={null} alt="Pending Image" />
          </Skeleton>
        </Card.Section>
        <SkeletonText mt="md" />
      </Card>
    ))}
  </SimpleGrid>
);

export default PendingGenerations;
