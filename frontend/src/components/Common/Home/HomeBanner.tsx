import { Link } from "@tanstack/react-router";
import { LOGO, PROJECT_NAME } from "@/const";
import {
  Text,
  Container,
  Group,
  Image,
  Anchor,
  Box,
  Title,
} from "@mantine/core";
import { Button } from "../../../components/ui/button";
const HomeBanner = () => {
  //   const user = useUser();
  return (
    <Container size="lg" mih={"100vh"} display={"flex"}>
      <Group gap="xl" justify="center" align="center">
        <Box flex={1}>
          <Title order={1} mb="xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.{" "}
            {PROJECT_NAME}
          </Title>
          <Text fz="lg" mb="xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque,
            quaerat minima ducimus doloribus dolore, inventore impedit iste
            maxime temporibus earum beatae tenetur quisquam enim reprehenderit
            rem necessitatibus eaque omnis deserunt.
          </Text>

          <Anchor component={Link} underline="never" to="/dashboard">
            <Button radius="xl" size="lg" variant="outline">
              Get Started
            </Button>
          </Anchor>
        </Box>

        {/* Right image */}
        <Box flex={1}>
          <Image src={LOGO} alt={PROJECT_NAME} w={320} mx="auto" />
        </Box>
      </Group>
    </Container>
  );
};

export default HomeBanner;
