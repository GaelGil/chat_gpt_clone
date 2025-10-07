import { SimpleGrid, Image, Skeleton } from "@mantine/core";

const PendingImages = ({ numImages }: { numImages: number }) => {
  return (
    <SimpleGrid cols={5} spacing={"1px"}>
      {[...Array(numImages)].map((_, index) => (
        <Skeleton visible={true}>
          <Image key={index} h={200} src={null} alt="Pending Image" />
        </Skeleton>
      ))}
    </SimpleGrid>
  );
};
export default PendingImages;
