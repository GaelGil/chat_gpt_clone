import { Image, SimpleGrid } from "@mantine/core";
import type { ImageGenerationPublic } from "@/client";

interface CanvasImagesProps {
  images: ImageGenerationPublic[];
}

const CanvasImages = ({ images }: CanvasImagesProps) => {
  return (
    <>
      <SimpleGrid cols={5} spacing={"1px"}>
        {images?.map((image: ImageGenerationPublic) => (
          <Image
            bd="1px solid grey"
            key={image.id}
            src={image.image_url}
            alt={image.id}
          />
        ))}
      </SimpleGrid>
    </>
  );
};

export default CanvasImages;
