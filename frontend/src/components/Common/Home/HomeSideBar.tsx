"use client"

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
import { FiArrowRight, FiColumns } from "react-icons/fi"
import { LOGO, PROJECT_NAME } from "@/const"

const items = [
  { title: "Research", link: "https://openai.com/research" },
  { title: "Safety", link: "https://openai.com/safety" },
  { title: "For Business", link: "https://openai.com/business" },
  { title: "For Developers", link: "https://openai.com/developers" },
  { title: "ChatGPT", link: "https://openai.com/chatgpt" },
  { title: "Sora", link: "https://openai.com/sora" },
  { title: "Stories", link: "https://openai.com/stories" },
  { title: "Company", link: "https://openai.com/company" },
  { title: "News", link: "https://openai.com/news" },
]

interface HomeSideBarProps {
  collapsed: boolean
  toggle: () => void
}

const HomeSideBar: React.FC<HomeSideBarProps> = ({ collapsed, toggle }) => {
  const listItems = items.map(({ title, link }) => (
    <Anchor
      key={title}
      href={link}
      target="_blank"
      rel="noreferrer"
      underline="never"
      display="block"
      style={{ borderRadius: 8 }}
    >
      <Flex
        align="center"
        px="sm"
        py={8}
        style={{ minHeight: 38, minWidth: 0 }}
      >
        <Text c="#f5f5f5" fz="sm" truncate>
          {title}
        </Text>
      </Flex>
    </Anchor>
  ))

  return (
    <Stack h="100%" gap="lg" p="md" bg="#000">
      {collapsed ? (
        <Stack align="center" gap="sm">
          <Anchor
            aria-label={`${PROJECT_NAME} Home`}
            underline="never"
            component={Link}
            to="/"
          >
            <Image src={LOGO} alt={`${PROJECT_NAME} Logo`} h={26} w={26} />
          </Anchor>
          <ActionIcon
            aria-label="Expand Navigation"
            onClick={toggle}
            variant="subtle"
            size="lg"
            radius="md"
            c="#f5f5f5"
            styles={{ root: { "&:hover": { background: "#171717" } } }}
          >
            <FiArrowRight size={18} aria-hidden="true" />
          </ActionIcon>
        </Stack>
      ) : (
        <>
          <Flex align="center" justify="space-between" w="100%">
            <Anchor
              aria-label={`${PROJECT_NAME} Home`}
              underline="never"
              component={Link}
              to="/"
            >
              <Image src={LOGO} alt={`${PROJECT_NAME} Logo`} h={32} w={32} />
            </Anchor>
            <ActionIcon
              aria-label="Collapse Navigation"
              onClick={toggle}
              variant="subtle"
              size="lg"
              radius="md"
              c="#b4b4b4"
              styles={{ root: { "&:hover": { background: "#171717" } } }}
            >
              <FiColumns size={18} aria-hidden="true" />
            </ActionIcon>
          </Flex>

          <Box style={{ minHeight: 0, overflowY: "auto" }}>{listItems}</Box>
        </>
      )}
    </Stack>
  )
}

export default HomeSideBar
