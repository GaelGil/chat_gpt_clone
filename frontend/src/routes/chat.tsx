import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import NewChatBanner from "@/components/Chat/NewChatBanner";
import ChatSideBar from "@/components/Chat/ChatSideBar";
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
        width: fullWidth,
        breakpoint: "sm",
        collapsed: { mobile: false, desktop: false },
      }}
    >
      {/* Sidebar */}
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

      {/* Main content */}
      <AppShell.Main
        style={{
          position: "relative",
          cursor: "pointer",
          borderRadius: "var(--mantine-radius-lg)",
          overflow: "hidden",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        <NewChatBanner />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
