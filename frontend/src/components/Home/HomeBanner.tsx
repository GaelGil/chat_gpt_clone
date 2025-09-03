import { Link } from "react-router-dom";
import { PROJECT_LOGO } from "../../data/ProjectLogo";
import { useUser } from "../../context/UserContext";
import {
  Text,
  Button,
  Container,
  Group,
  Image,
  Anchor,
  Box,
} from "@mantine/core";
const HomeBanner = () => {
  const user = useUser();
  return (
    <Container size="lg" mih={"100vh"} display={"flex"}>
      <Group gap="xl" justify="center" align="center">
        <Box flex={1}>
          <Text fz="lg" c="var(--mantine-color-text-primary)" mb="xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque,
            quaerat minima ducimus doloribus dolore, inventore impedit iste
            maxime temporibus earum beatae tenetur quisquam enim reprehenderit
            rem necessitatibus eaque omnis deserunt.
          </Text>

          <Anchor
            component={Link}
            to={user ? "/chat" : "/login"}
            underline="never"
          >
            <Button
              radius="xl"
              size="lg"
              variant="outline"
              c="var(--mantine-color-text-primary)"
              bd={"1px solid var(--mantine-color-text-primary)"}
            >
              Chat
            </Button>
          </Anchor>
        </Box>

        {/* Right image */}
        <Box flex={1}>
          <Image
            src={PROJECT_LOGO}
            alt="Order Agent"
            w={320}
            radius="xl"
            mx="auto"
          />
        </Box>
      </Group>
    </Container>
  );
};

export default HomeBanner;
