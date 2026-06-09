import {
  ActionIcon,
  Anchor,
  Box,
  Flex,
  Image,
  Stack,
  Text,
} from "@mantine/core"
import { Link } from "@tanstack/react-router"
import { FiArrowRight, FiColumns, FiEdit } from "react-icons/fi"
import { LOGO, PROJECT_NAME } from "@/const"
import UserMenu from "../Common/UserMenu"
import Chats from "./Chats"

interface SidebarProps {
  collapsed: boolean
  toggle: () => void
}

const ChatSideBar: React.FC<SidebarProps> = ({ collapsed, toggle }) => {
  return (
    <Stack h="100%" gap={0} p={8} bg="#181818">
      {collapsed ? (
        <Stack align="center" gap={8}>
          <Anchor
            aria-label={`${PROJECT_NAME} Home`}
            component={Link}
            to="/"
            underline="never"
          >
            <Image src={LOGO} alt={`${PROJECT_NAME} Logo`} h={30} w={30} />
          </Anchor>
          <ActionIcon
            aria-label="Expand Sidebar"
            onClick={toggle}
            variant="subtle"
            size="lg"
            radius="md"
            c="#ececec"
            styles={{ root: { "&:hover": { background: "#2f2f2f" } } }}
          >
            <FiArrowRight size={18} aria-hidden="true" />
          </ActionIcon>
          <ActionIcon
            aria-label="New Chat"
            component={Link}
            to="/chat"
            variant="subtle"
            size="lg"
            radius="md"
            c="#ececec"
            styles={{ root: { "&:hover": { background: "#2f2f2f" } } }}
          >
            <FiEdit size={18} aria-hidden="true" />
          </ActionIcon>
        </Stack>
      ) : (
        <Flex direction="column" h="100%" style={{ minHeight: 0 }}>
          <Flex align="center" justify="space-between" w="100%" mb="md">
            <Anchor
              aria-label={`${PROJECT_NAME} Home`}
              underline="never"
              component={Link}
              to="/"
            >
              <Image src={LOGO} alt={`${PROJECT_NAME} Logo`} h={32} w={32} />
            </Anchor>

            <ActionIcon
              aria-label="Collapse Sidebar"
              onClick={toggle}
              variant="subtle"
              size="lg"
              radius="md"
              c="#b4b4b4"
              styles={{ root: { "&:hover": { background: "#2f2f2f" } } }}
            >
              <FiColumns size={18} aria-hidden="true" />
            </ActionIcon>
          </Flex>

          <Anchor component={Link} to="/chat" underline="never" mb="md">
            <Flex
              align="center"
              gap="xs"
              px="sm"
              py={8}
              bdrs="md"
              c="#ececec"
              style={{
                minHeight: 40,
              }}
            >
              <FiEdit size={18} aria-hidden="true" />
              <Text fz="sm" fw={500}>
                New Chat
              </Text>
            </Flex>
          </Anchor>

          <Box
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <Text c="#b4b4b4" fz="xs" fw={600} mb="xs" px="sm">
              Chats
            </Text>
            <Chats />
          </Box>

          <Box pt="sm">
            <UserMenu />
          </Box>
        </Flex>
      )}
    </Stack>
  )
}

export default ChatSideBar
