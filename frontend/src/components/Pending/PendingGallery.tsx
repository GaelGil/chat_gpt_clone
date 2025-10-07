import { Card, Skeleton, SimpleGrid, Image } from "@mantine/core";

function PendingGallery() {
  return (
    <SimpleGrid cols={5}>
      {[...Array(15)].map((_, index) => (
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
              <Image h={200} src={""} alt="Pending Image" />
            </Skeleton>
          </Card.Section>
        </Card>
      ))}
    </SimpleGrid>
  );
}

export default PendingGallery;
