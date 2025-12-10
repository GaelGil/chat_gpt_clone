import { AppShell, Box, Container, Flex, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import NewChatBanner from "@/components/Chat/NewChatBanner";
import ChatSideBar from "@/components/Chat/ChatSideBar";
import { PROJECT_NAME } from "@/const";
export const Route = createFileRoute("/chat")({
  component: Chat,
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
        style={{
          flexShrink: 0,
          transition: "width 0.3s ease",
          borderRight:
            "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))",
          backgroundColor:
            "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-7))",
        }}
      >
        <ChatSideBar collapsed={collapsed} toggle={toggleCollapsed} />
      </AppShell.Navbar>

      <AppShell.Header>
        <Container h="60px" p="md">
          <Text>{PROJECT_NAME}</Text>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <NewChatBanner />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
