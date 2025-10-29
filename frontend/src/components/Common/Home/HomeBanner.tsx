import { Link } from "@tanstack/react-router";
import { PROJECT_NAME } from "@/const";
import { Text, Container, Stack, Anchor, Box, Title } from "@mantine/core";
import { Button } from "../../../components/ui/button";
const HomeBanner = () => {
  const today = new Date().toLocaleDateString();
  //   const user = useUser();
  return (
    <Container
      size="md"
      // mih="100vh"
      // display="flex"
      h={"100%"}
    >
      <Stack align="center" gap="xl" mt={"xl"}>
        {/* Project name and date */}
        <Box ta={"center"}>
          <Title order={2}>{PROJECT_NAME}</Title>
          <Text fz="sm" c="dimmed">
            {today}
          </Text>
          <Anchor component={Link} underline="never" to="/chat">
            <Button radius="xl" size="lg" variant="outline">
              Get Started
            </Button>
          </Anchor>
        </Box>

        {/* Main text */}
        <Box maw={600}>
          <Title order={1} mb="md">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Title>
          <Text fz="lg" mb="xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque,
            quaerat minima ducimus doloribus dolore, inventore impedit iste
            maxime temporibus earum beatae tenetur quisquam enim reprehenderit
            rem necessitatibus eaque omnis deserunt.
          </Text>
        </Box>
      </Stack>
    </Container>
  );
};

export default HomeBanner;
