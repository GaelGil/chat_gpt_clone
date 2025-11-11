import {
  AppShell,
  Burger,
  Group,
  Flex,
  Box,
  Text,
  Anchor,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PROJECT_NAME } from "@/const";
import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import Chats from "@/components/Chat/ChatSideBar";
import NewChatBanner from "@/components/Chat/NewChatBanner";

export const Route = createFileRoute("/chat")({
  component: Chat,
  // beforeLoad: async () => {
  //   if (!isLoggedIn()) {
  //     throw redirect({
  //       to: "/auth/login",
  //     });
  //   }
  // },
});
function Chat() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  // Sidebar widths
  const fullWidth = 250; // px
  const collapsedWidth = fullWidth * 0.1; // 10% of full width (25px)

  return (
    <AppShell
      padding="md"
      // ✅ Removed header entirely
      navbar={{
        width: fullWidth,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
    >
      {/* ✅ Sidebar (Navbar) */}
      <AppShell.Navbar
        p="md"
        style={{
          width: desktopOpened ? fullWidth : collapsedWidth,
          transition: "width 0.3s ease",
          overflow: "hidden",
        }}
      >
        {/* Sidebar header with logo + toggle */}
        <Flex align="center" justify="space-between" mb="md">
          <Anchor component={Link} to="/" underline="never">
            <Text fz="xl" fw={700}>
              {PROJECT_NAME}
            </Text>
          </Anchor>

          {/* ✅ Only one burger button inside the sidebar */}
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            size="sm"
            visibleFrom="sm"
          />
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            size="sm"
            hiddenFrom="sm"
          />
        </Flex>

        {/* Sidebar content */}
        <Chats />
      </AppShell.Navbar>

      {/* ✅ Main content */}
      <AppShell.Main>
        <NewChatBanner />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
