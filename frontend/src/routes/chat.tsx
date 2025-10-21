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
      header={{ height: 60 }}
      navbar={{
        width: fullWidth,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: false }, // let us handle desktop manually
      }}
    >
      <AppShell.Header>
        <Box component="header" w={"100%"} p={"md"}>
          <Flex justify="space-between" align="center">
            <Group>
              <Burger
                opened={mobileOpened}
                onClick={toggleMobile}
                hiddenFrom="sm"
                size="sm"
              />
              <Burger
                opened={desktopOpened}
                onClick={toggleDesktop}
                visibleFrom="sm"
                size="sm"
              />
            </Group>
          </Flex>
        </Box>
      </AppShell.Header>
      {/* Navbar (Sidebar) */}
      <AppShell.Navbar
        p="md"
        style={{
          width: desktopOpened ? fullWidth : collapsedWidth,
          tansition: "width 0.4s ease",
          overflow: "hidden",
        }}
      >
        <Box w={300}>
          <Flex align="center" p="md" gap="sm" justify="space-between">
            <Flex align="center" gap="sm">
              <Anchor component={Link} to="/" underline="never">
                <Text fz="xl" fw={700}>
                  {PROJECT_NAME}
                </Text>
              </Anchor>
              <Group>
                <Burger
                  opened={mobileOpened}
                  onClick={toggleMobile}
                  hiddenFrom="sm"
                  size="sm"
                />
                <Burger
                  opened={desktopOpened}
                  onClick={toggleDesktop}
                  visibleFrom="sm"
                  size="sm"
                />
              </Group>
            </Flex>
          </Flex>
          <Chats />
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
