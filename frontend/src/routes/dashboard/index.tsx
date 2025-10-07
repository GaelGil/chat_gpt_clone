import { Box, Container, Text } from "@mantine/core";

import { createFileRoute } from "@tanstack/react-router";

import useAuth from "@/hooks/useAuth";

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});

function Dashboard() {
  const { user: currentUser } = useAuth();

  return (
    <Container mah="full">
      <Box pt={12} m={4}>
        <Text fz="2xl">
          Hi,{currentUser?.full_name || currentUser?.email} 👋🏼
        </Text>
        <Text>Welcome back, nice to see you again!</Text>
      </Box>
    </Container>
  );
}
