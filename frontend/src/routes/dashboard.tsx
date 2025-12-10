import { Flex, Box } from "@mantine/core";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import Navbar from "@/components/Common/Navbar";
import SideBar from "@/components/Common/SideBar/SideBar";
import { isLoggedIn } from "@/hooks/useAuth";
import { useDisclosure } from "@mantine/hooks";

export const Route = createFileRoute("/dashboard")({
  component: Layout,
  beforeLoad: async () => {
    if (!isLoggedIn()) {
      throw redirect({
        to: "/auth/login",
      });
    }
  },
});

function Layout() {
  const [collapsed, { toggle: toggleCollapsed }] = useDisclosure(false);

  return (
    <Flex direction="column">
      <Navbar />
      <Flex flex="1">
        <SideBar collapsed={collapsed} toggle={toggleCollapsed} />
        <Box
          style={{ flex: 1, overflow: "hidden", position: "relative" }}
          bg="dark.7"
        >
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}
