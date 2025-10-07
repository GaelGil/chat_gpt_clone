"use client";

import { Box, Group, Text } from "@mantine/core";


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
];

interface SidebarItemsProps {
  onClose?: () => void;
}



const HomeItems = ({ onClose }: SidebarItemsProps) => {


  const listItems = items.map(({ title, link }) => (
      <Group gap="sm" px="md" py="sm" align="center" fz={"14px"}>
            <a key={title} href={link} onClick={onClose}>

        <Text ml={2}>{title}</Text>
      </a>
      </Group>
  ));

  return (
    <>
      <Box mt={20}>{listItems}</Box>
    </>
  );
};

export default HomeItems;
