"use client";

import { Button, Center, Flex, Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";

const NotFound = () => {
  return (
    <Flex
      style={{ height: "100vh", flexDirection: "column", padding: 16 }}
      align="center"
      justify="center"
      data-testid="not-found"
    >
      <Flex align="center" style={{ zIndex: 1 }}>
        <Flex
          direction="column"
          align="center"
          justify="center"
          style={{ marginLeft: 16, padding: 16 }}
        >
          <Text
            w={700}
            style={{ lineHeight: 1, textAlign: "center", marginBottom: 16 }}
            fz={80}
          >
            404
          </Text>
          <Text
            w={700}
            size="xl"
            style={{ marginBottom: 8, textAlign: "center" }}
          >
            Oops!
          </Text>
        </Flex>
      </Flex>

      <Text
        size="lg"
        c="gray"
        style={{ marginBottom: 16, textAlign: "center", zIndex: 1 }}
      >
        The page you are looking for was not found.
      </Text>

      <Center style={{ zIndex: 1 }}>
        <Link to="/">
          <Button variant="filled" color="teal" style={{ marginTop: 16 }}>
            Go Back
          </Button>
        </Link>
      </Center>
    </Flex>
  );
};

export default NotFound;
