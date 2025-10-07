import { Flex, Image, Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Link } from "@tanstack/react-router";

import { LOGO } from "@/const";
import UserMenu from "./UserMenu";

function Navbar() {
  // show navbar only on md and up
  const isMdUp = useMediaQuery("(min-width: 768px)");

  if (!isMdUp) return null; // hide navbar on smaller screens

  return (
    <Box component="header" w={"100%"} p={"md"}>
      <Flex justify="space-between" align="center">
        <Link to="/">
          <Image src={LOGO} alt="Logo" maw={120} p="sm" />
        </Link>

        <Flex gap="sm" align="center">
          <UserMenu />
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar;
