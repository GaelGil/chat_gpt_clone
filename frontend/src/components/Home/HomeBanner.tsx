import { Link } from "react-router-dom";
import { PROJECT_LOGO } from "../../data/ProjectLogo";
import { useUser } from "../../context/UserContext";
import { Text, Button, Container, Group, Image, Anchor } from "@mantine/core";
const HomeBanner = () => {
  const user = useUser();
  return (
    <Container
      size="lg"
      style={{ minHeight: "80vh", display: "flex", alignItems: "center" }}
    >
      <Group align="center" justify="space-between" gap="xl">
        {/* Left content */}
        <div style={{ flex: 1 }}>
          <Text fz="lg" c="brand.0" mb="xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque,
            quaerat minima ducimus doloribus dolore, inventore impedit iste
            maxime temporibus earum beatae tenetur quisquam enim reprehenderit
            rem necessitatibus eaque omnis deserunt.
          </Text>

          <Anchor
            component={Link}
            to={user ? "/chat" : "/login"}
            style={{
              display: "flex",
              alignItems: "center",
            }}
            underline="never"
          >
            <Button
              variant="outline" // gives border only
              radius="xl" // makes it oval
              size="lg" // adjust size
              styles={(theme) => ({
                root: {
                  borderColor: theme.colors.brand[0], // border color
                  color: theme.colors.brand[0], // text color
                },
              })}
            >
              Chat
            </Button>
          </Anchor>
        </div>

        {/* Right image */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <Image
            src={PROJECT_LOGO}
            alt="Order Agent"
            w={320}
            radius="xl"
            mx="auto"
          />
        </div>
      </Group>
    </Container>
  );
};

export default HomeBanner;
