import {  AppShell, Burger, Text, Anchor} from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { createFileRoute, Outlet, redirect, Link } from "@tanstack/react-router";
import Chats from "@/components/Chat/ChatSideBar";
import { isLoggedIn } from "@/hooks/useAuth";

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
  const [opened, { toggle }] = useDisclosure();
  // const loggedIn = isLoggedIn();
  return (
    <AppShell
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
      
    >

      <AppShell.Navbar p="md" withBorder={false}>
        <Chats />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

