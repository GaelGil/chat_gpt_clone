import { Flex, Box } from "@mantine/core";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import Navbar from "@/components/Common/Navbar";
import Sidebar from "@/components/Common/Sidebar";
import { isLoggedIn } from "@/hooks/useAuth";

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
  return (
    <Flex direction="column">
      <Navbar />
      <Flex flex="1">
        <Sidebar />
        <Box style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}

export default Layout;
