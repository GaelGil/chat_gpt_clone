import { Anchor, AppShell, Group } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { isLoggedIn } from "@/hooks/useAuth"
import HomeBanner from "../components/Common/Home/HomeBanner"
import HomeSideBar from "../components/Common/Home/HomeSideBar"
export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  const loggedIn = isLoggedIn()
  const [collapsed, { toggle: toggleCollapsed }] = useDisclosure(false)

  const fullWidth = 200
  const collapsedWidth = 60

  const sidebarWidth = collapsed ? collapsedWidth : fullWidth

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      navbar={{
        width: sidebarWidth,
        breakpoint: "sm",
        collapsed: { mobile: false, desktop: false },
      }}
      padding={0}
      bg="#000"
    >
      <AppShell.Header withBorder={false} bg="#000">
        <Group h="100%" px={{ base: "md", sm: "xl" }} justify="flex-end">
          <Anchor
            component={Link}
            to={!loggedIn ? "/chat" : "/auth/login"}
            underline="never"
          >
            <Button radius="xl">{loggedIn ? "Open Chat" : "Log In"}</Button>
          </Anchor>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p={0} withBorder={false} bg="#000">
        <HomeSideBar collapsed={collapsed} toggle={toggleCollapsed} />
      </AppShell.Navbar>
      <AppShell.Main bg="#000">
        <HomeBanner loggedIn={loggedIn} />
      </AppShell.Main>
    </AppShell>
  )
}
