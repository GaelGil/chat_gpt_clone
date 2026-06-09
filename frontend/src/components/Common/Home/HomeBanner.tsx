import {
  Anchor,
  Box,
  Container,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import { Link } from "@tanstack/react-router"
import { PROJECT_NAME } from "@/const"
import { Button } from "../../../components/ui/button"

interface HomeBannerProps {
  loggedIn: boolean
}

const features = [
  {
    title: "Fast Conversations",
    description:
      "Start a prompt and get a clean streaming-style workspace for everyday questions.",
  },
  {
    title: "Saved Chats",
    description:
      "Return to previous sessions from the sidebar and keep work organized.",
  },
  {
    title: "Simple Workspace",
    description: "A focused ChatGPT-inspired interface without extra clutter.",
  },
]

const HomeBanner: React.FC<HomeBannerProps> = ({ loggedIn }) => {
  return (
    <Container size="xl" px={{ base: "md", sm: "xl" }}>
      <Stack justify="center" gap={64} mih="calc(100vh - 60px)" py={80}>
        <Box maw={920}>
          <Text c="#b4b4b4" fz="sm" mb="md" tt="uppercase" lts={1.2}>
            ChatGPT-inspired AI workspace
          </Text>
          <Title
            order={1}
            fw={500}
            c="white"
            fz={{ base: 48, md: 84 }}
            lh={0.95}
            mb="xl"
            style={{ textWrap: "balance" }}
          >
            {PROJECT_NAME}
          </Title>

          <Text
            fz={{ base: "lg", md: 24 }}
            c="#d7d7d7"
            lh={1.45}
            maw={720}
            mb="xl"
          >
            A simple conversational AI clone with saved chats, a focused
            workspace, and a familiar ChatGPT-style flow.
          </Text>

          <Flex gap="sm" wrap="wrap">
            <Anchor
              component={Link}
              underline="never"
              to={loggedIn ? "/chat" : "/auth/login"}
            >
              <Button radius="xl" size="lg" px="xl">
                {loggedIn ? "Open Chat" : "Try ChatGPT Clone"}
              </Button>
            </Anchor>
            <Anchor component={Link} underline="never" to="/auth/signup">
              <Button radius="xl" size="lg" variant="outline" px="xl">
                Create Account
              </Button>
            </Anchor>
          </Flex>
        </Box>

        <Box>
          <Title
            order={2}
            fw={500}
            c="white"
            fz={{ base: 28, md: 42 }}
            mb="xl"
            style={{ textWrap: "balance" }}
          >
            Built for a small, focused clone project.
          </Title>
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
            {features.map((feature) => (
              <Box
                key={feature.title}
                p="lg"
                bdrs="lg"
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  background: "rgba(255, 255, 255, 0.03)",
                }}
              >
                <Title order={3} c="white" fz="lg" fw={500} mb="sm">
                  {feature.title}
                </Title>
                <Text c="#b4b4b4" lh={1.6}>
                  {feature.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Stack>
    </Container>
  )
}

export default HomeBanner
