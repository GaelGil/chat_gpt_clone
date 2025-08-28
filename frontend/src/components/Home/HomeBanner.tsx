import { Link } from "react-router-dom";
import { PROJECT_NAME } from "../../data/ProjectName";
import { PROJECT_LOGO } from "../../data/ProjectLogo";
import { useUser } from "../../context/UserContext";
import { Text, Title, Button, Container, Group, Image } from "@mantine/core";

const HomeBanner = () => {
  const user = useUser();
  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center" }}>
      <Container size="lg">
        <Group align="center" justify="space-between" gap="xl">
          {/* Left content */}
          <div style={{ flex: 1 }}>
            <Title order={1} fw={900} fz={{ base: 40, md: 56 }} mb="lg">
              <Text span c="brand.6">
                {PROJECT_NAME}
              </Text>
            </Title>

            <Text fz="lg" c="primary" mb="xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque,
              quaerat minima ducimus doloribus dolore, inventore impedit iste
              maxime temporibus earum beatae tenetur quisquam enim reprehenderit
              rem necessitatibus eaque omnis deserunt.
            </Text>

            <Link to={user ? "/chat" : "/login"}>
              <Button size="lg" color="brand">
                View Content
              </Button>
            </Link>
          </div>

          {/* Right image */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <Image
              src={PROJECT_LOGO}
              alt="Order Agent"
              w={320}
              radius="xl"
              // shadow="xl"
              mx="auto"
            />
          </div>
        </Group>
      </Container>
    </div>
  );
};

export default HomeBanner;
