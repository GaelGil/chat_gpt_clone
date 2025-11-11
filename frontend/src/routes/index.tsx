// routes/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useDisclosure } from "@mantine/hooks";
import { AppShell, Burger, Text, Anchor, Flex } from "@mantine/core";
import { Button } from "@/components/ui/button";
import HomeBanner from "../components/Common/Home/HomeBanner";
import { isLoggedIn } from "@/hooks/useAuth";
import { PROJECT_NAME } from "@/const";
import HomeItems from "../components/Common/Home/HomeItems";
export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [opened, { toggle }] = useDisclosure();
  const loggedIn = isLoggedIn();
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
      bg={"black"}
      c={"white"}
    >
      <AppShell.Header withBorder={false} bg={"black"}>
        <Flex h="100%" px="md" align="center" justify="space-between">
          {/* Left side: logo + project name */}
          <Flex align="center">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Anchor
              component={Link}
              to="/"
              display="flex"
              underline="never"
              style={{ alignItems: "center" }}
            >
              <Text fz="xl" fw={700} ml="sm">
                {PROJECT_NAME}
              </Text>
            </Anchor>
          </Flex>

          {/* Right side: button */}
          <Anchor
            component={Link}
            to={loggedIn ? "/chat" : "/auth/login"}
            underline="never"
          >
            <Button radius="xl">{loggedIn ? "Dashboard" : "Login"}</Button>
          </Anchor>
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar p="md" withBorder={false} bg={"black"}>
        <HomeItems />
      </AppShell.Navbar>
      <AppShell.Main>
        <HomeBanner />
      </AppShell.Main>
    </AppShell>
  );
}
