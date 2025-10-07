"use client";

import { Container, Title, Text } from "@mantine/core";

import DeleteConfirmation from "./DeleteConfirmation";

const DeleteAccount = () => {
  return (
    <Container size="xl" px="md">
      <Title order={4} py="md">
        Delete Account
      </Title>
      <Text>
        Permanently delete your data and everything associated with your
        account.
      </Text>
      <DeleteConfirmation />
    </Container>
  );
};

export default DeleteAccount;
