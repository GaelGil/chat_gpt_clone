import { AppShell, Burger, Flex, Text, Anchor, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
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
        style={{
          width: collapsed ? collapsedWidth : fullWidth,
          transition: "width 0.3s ease",
          overflow: "hidden",
        }}
      >
        <Box
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
          {/* <SideBar collapsed={collapsed} toggle={toggleCollapsed} /> */}
          <ChatSideBar collapsed={collapsed} toggle={toggleCollapsed} />
        </Box>
      </AppShell.Navbar>

      {/* Main content */}
      <AppShell.Main>
        <NewChatBanner />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
