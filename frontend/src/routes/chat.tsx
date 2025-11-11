import { AppShell, Burger, Flex, Text, Anchor } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PROJECT_NAME } from "@/const";
import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import Chats from "@/components/Chat/ChatSideBar";
import NewChatBanner from "@/components/Chat/NewChatBanner";

export const Route = createFileRoute("/chat")({
  component: Chat,
});
function Chat() {
  const [collapsed, { toggle: toggleCollapsed }] = useDisclosure(false);

  const fullWidth = 250; // full sidebar width
  const collapsedWidth = fullWidth * 0.2; // 10% width (25px)

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
        {/* Sidebar top: logo + toggle button */}
        <Flex align="center" justify="space-between" mb="md">
          {/* Show logo only when sidebar is open */}
          {!collapsed && (
            <Anchor component={Link} to="/" underline="never">
              <Text fz="xl" fw={700}>
                {PROJECT_NAME}
              </Text>
            </Anchor>
          )}

          {/* Toggle button */}
          <Burger opened={!collapsed} onClick={toggleCollapsed} size="sm" />
        </Flex>

        {/* Sidebar content */}
        {!collapsed && <Chats />}
      </AppShell.Navbar>

      {/* Main content */}
      <AppShell.Main>
        <NewChatBanner />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
