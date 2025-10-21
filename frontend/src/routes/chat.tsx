import { AppShell, Burger, Group, Flex, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createFileRoute, Outlet } from "@tanstack/react-router";
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
  // const [opened, { toggle }] = useDisclosure();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  // const loggedIn = isLoggedIn();
  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
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

      <>
        <AppShell>
          <AppShell.Navbar>
            <Chats />
          </AppShell.Navbar>
        </AppShell>
      </>

      <AppShell.Main flex={"1"}>
        <NewChatBanner />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
