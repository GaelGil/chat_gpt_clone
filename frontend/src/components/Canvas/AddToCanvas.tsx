import {
  Text,
  Box,
  Flex,
  Textarea,
  Select,
  Slider,
  Loader,
} from "@mantine/core";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { GenerationService } from "@/client";
import {
  DialogContent,
  DialogCloseTrigger,
  DialogTitle,
  DialogHeader,
  DialogBody,
} from "../ui/dialog";
import { FiArrowUp, FiSettings } from "react-icons/fi";

const AddToCanvas = ({ id }: { id: string }) => {
  const [prompt, setPrompt] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [provider, setProvider] = useState("fal");
  const [model, setModel] = useState("fal-ai/flux/dev");
  const [imageSize, setImageSize] = useState("square_hd");
  const [numImages, setNumImages] = useState(4);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const providers = [
    {
      value: "fal",
      label: "Fal.ai",
      models: [
        { value: "fal-ai/flux/dev", label: "fal-ai/flux/dev" },
        {
          value: "fal-ai/recraft-v3",
          label: "fal-ai/recraft-v3",
        },
        {
          value: "fal-ai/stable-diffusion-v35-large",
          label: "fal-ai/stable-diffusion-v35-large:",
        },
      ],
      image_sizes: [
        { value: "square_hd", label: "square_hd" },
        { value: "square", label: "square" },
        { value: "portrait_4_3", label: "portrait_4_3" },
        { value: "portrait_16_9", label: "portrait_16_9" },
        { value: "landscape_4_3", label: "landscape_4_3" },
        { value: "landscape_16_9", label: "landscape_16_9" },
      ],
    },
  ];

  const handleSend = async () => {
    setDisabled(true);
    if (!prompt.trim()) return;

    try {
      const response = await GenerationService.createGeneration({
        requestBody: {
          prompt: prompt,
          provider: provider,
          model: model,
          num_images: numImages,
          image_size: imageSize,
          canvas_id: id,
        },
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setPrompt("");
      setDisabled(false);
    }
  };

  return (
    <>
      <Box pos="fixed" bottom={"5%"} left={"25%"} w="50%" mx="auto">
        <Flex gap="sm" align="flex-end" pos={"relative"}>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Describe what you want to see"
            radius="xl"
            autosize
            minRows={3}
            w="100%"
            size="xl"
          />

          {prompt ? (
            <Box pos="absolute" right={0} p={"md"}>
              <Button
                onClick={handleSend}
                disabled={disabled || !prompt}
                radius="xl"
                size="xl"
                px="lg"
                bg={!disabled ? "white" : "transparent"}
              >
                {!disabled ? (
                  <FiArrowUp color="black" />
                ) : (
                  <Loader color="white" />
                )}
              </Button>
            </Box>
          ) : (
            <></>
          )}

          <DialogContent
            opened={isOpen}
            onClose={() => setIsOpen(false)}
            size="md"
            centered
            portalled
            style={{ padding: 20 }}
          >
            <DialogHeader>
              <DialogTitle>Select Provider</DialogTitle>
              <DialogCloseTrigger onClick={() => setIsOpen(false)} />
            </DialogHeader>

            <DialogBody>
              <Select
                label="Provider"
                placeholder="Select a provider"
                data={providers}
                value={provider}
                onChange={(value) => setProvider(value ?? "")}
              />
              <Select
                label="Model"
                placeholder="Select a model"
                data={providers.find((p) => p.value === provider)?.models ?? []}
                value={model}
                onChange={(value) => setModel(value ?? "")}
              />
              <Select
                label="Image Size"
                placeholder="Select image size"
                data={
                  providers.find((p) => p.value === provider)?.image_sizes ?? []
                }
                value={imageSize}
                onChange={(value) => setImageSize(value ?? "")}
              />

              <Text mt="m-xl">
                <strong>Number of Image Generations:</strong> {numImages}
              </Text>
              <Slider
                value={numImages}
                onChange={(numImages) => setNumImages(numImages)}
                min={1}
                max={4}
                step={1}
                radius="xl"
                size="lg"
                px="lg"
              />
            </DialogBody>
          </DialogContent>

          <Box pos="absolute" p={"sm"}>
            <Button
              onClick={() => setIsOpen(true)}
              radius="xl"
              bg="transparent"
              bd="1px solid gray.7"
            >
              <FiSettings />
            </Button>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default AddToCanvas;
