import { AppShell, Container, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import ChatSideBar from "@/components/Chat/ChatSideBar";
import InitMessage from "@/components/Chat/Messages/InitMesssage";
import { PROJECT_NAME } from "@/const";
import { isLoggedIn } from "@/hooks/useAuth";
import { redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/")({
  component: Chat,
  beforeLoad: async () => {
    if (!isLoggedIn()) {
      throw redirect({
        to: "/auth/login",
      });
    }
  },
});
function Chat() {
  const [collapsed, { toggle: toggleCollapsed }] = useDisclosure(false);

  const fullWidth = 300;
  const collapsedWidth = 60;

  const sidebarWidth = collapsed ? collapsedWidth : fullWidth;

  return (
    <AppShell
      padding="md"
      navbar={{
        width: sidebarWidth,
        breakpoint: "sm",
        collapsed: { mobile: false, desktop: false },
      }}
      styles={{
        root: {
          ["--app-shell-navbar-width" as any]: `${sidebarWidth}px`,
          transition: "var(--app-shell-transition)",
        },
        main: {
          transition: "padding-left 0.3s ease",
        },
        header: {
          transition: "padding-left 0.3s ease",
        },
      }}
    >
      <AppShell.Navbar
        p="sm"
        w={sidebarWidth}
        h="100vh"
        bg="#181818"
        style={{
          flexShrink: 0,
          transition: "width 0.3s ease",
        }}
        withBorder={false}
      >
        {/* sidebar: #181818",
          main: #212121
          inputbar: #303030
        */}
        <ChatSideBar collapsed={collapsed} toggle={toggleCollapsed} />
      </AppShell.Navbar>

      <AppShell.Header bg="#212121">
        <Container h="60px" p="md">
          <Text>{PROJECT_NAME}</Text>
        </Container>
      </AppShell.Header>

      <AppShell.Main bg={"#212121"}>
        <InitMessage />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
