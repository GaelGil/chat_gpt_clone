import { Link } from "@tanstack/react-router";
import { LOGO, PROJECT_NAME } from "@/const";
import { Button } from "@/components/ui/button";
import { Anchor, Text, Group, Image, Box } from "@mantine/core";
import { isLoggedIn } from "@/hooks/useAuth";

const Navigation = () => {
  const loggedIn = isLoggedIn(); // assuming isLoggedIn is a function that returns a boolean

  return (
    <Box
      px="xl"
      py="sm"
      bg="black"
      style={{ borderBottom: "1px solid var(--mantine-color-gray-3)" }}
    >
      <Group align="center" maw={1200} m="0 auto" gap="xl">
        <Anchor
          component={Link}
          to="/"
          display="flex"
          underline="never"
          style={{ alignItems: "center" }}
        >
          <Image src={LOGO} alt="Logo" maw={60} p={2} />
          <Text c="var(--mantine-color-text-primary)" fz="xl" fw={700} ml="sm">
            {PROJECT_NAME}
          </Text>
        </Anchor>
        <Box style={{ flex: 1 }} />

        <Group align="center" gap="lg">
          <Anchor component={Link} to="/features" underline="never">
            Features
          </Anchor>
          <Anchor component={Link} to="/solutions" underline="never">
            Solutions
          </Anchor>
          <Anchor component={Link} to="/learn" underline="never">
            Learn
          </Anchor>
          <Anchor component={Link} to="/for-teams" underline="never">
            For Teams
          </Anchor>
          <Anchor component={Link} to="/for-devs" underline="never">
            For Devs
          </Anchor>
          <Anchor component={Link} to="/pricing" underline="never">
            Pricing
          </Anchor>
          <Anchor component={Link} to="/contact" underline="never">
            Contact
          </Anchor>
        </Group>
        <Box style={{ flex: 1 }} />

        <Group align="center" gap="md">
          <Anchor
            component={Link}
            to={loggedIn ? "/dashboard" : "/auth/login"}
            underline="never"
          >
            <Button radius="xl" variant="outline">
              {loggedIn ? "Dashboard" : "Login"}
            </Button>
          </Anchor>
        </Group>
      </Group>
    </Box>
  );
};

export default Navigation;
