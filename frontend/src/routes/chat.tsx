import { AppShell, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import ChatSideBar from "@/components/Chat/ChatSideBar";
import { PROJECT_NAME } from "@/const";
import { isLoggedIn } from "@/hooks/useAuth";
import { redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/chat")({
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

  const fullWidth = 260;
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
        <ChatSideBar collapsed={collapsed} toggle={toggleCollapsed} />
      </AppShell.Navbar>
      <AppShell.Header bg="#212121">
        <Group h="100%" px="md" justify="flex-start">
          <Text>{PROJECT_NAME}</Text>
        </Group>
      </AppShell.Header>
      <AppShell.Main bg={"#212121"} h="100vh">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
