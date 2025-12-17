// routes/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useDisclosure } from "@mantine/hooks";
import { AppShell, Anchor, Group } from "@mantine/core";
import { Button } from "@/components/ui/button";
import HomeBanner from "../components/Common/Home/HomeBanner";
import { isLoggedIn } from "@/hooks/useAuth";
import HomeSideBar from "../components/Common/Home/HomeSideBar";
export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const loggedIn = isLoggedIn();
  const [collapsed, { toggle: toggleCollapsed }] = useDisclosure(false);

  const fullWidth = 200;
  const collapsedWidth = 60;

  const sidebarWidth = collapsed ? collapsedWidth : fullWidth;

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      navbar={{
        width: sidebarWidth,
        breakpoint: "sm",
        collapsed: { mobile: false, desktop: false },
      }}
      padding="md"
      bg={"black"}
    >
      <AppShell.Header withBorder={false} bg={"black"}>
        <Group h="100%" px="md" justify="flex-end">
          <Anchor
            component={Link}
            to={loggedIn ? "/chat" : "/auth/login"}
            underline="never"
          >
            <Button radius="xl">{loggedIn ? "Chat" : "Login"}</Button>
          </Anchor>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md" withBorder={false} bg={"black"}>
        <HomeSideBar collapsed={collapsed} toggle={toggleCollapsed} />
      </AppShell.Navbar>
      <AppShell.Main>
        <HomeBanner />
      </AppShell.Main>
    </AppShell>
  );
}
