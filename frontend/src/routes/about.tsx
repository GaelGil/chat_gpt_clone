"use client";

import { createFileRoute } from "@tanstack/react-router";
import {
  Container,
  Grid,
  Text,
  Title,
  Card,
  Avatar,
  Stack,
  Divider,
  Box,
  Button,
} from "@mantine/core";
import Navbar from "@/components/Common/Layout/HomeNav";
import Footer from "@/components/Common/Layout/Footer";
import { PROJECT_NAME } from "@/const";
export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <>
      <Navbar />
      <Container size="lg" py="xl">
        {/* Hero Section */}
        <Stack gap="xl" align="center" mb="xl">
          <Title order={1}>About {PROJECT_NAME}</Title>
          <Text size="lg" c="dimmed" maw={720}>
            At {PROJECT_NAME}, we build innovative solutions that empower
            businesses and people to achieve more. Our mission is to combine
            technology and creativity to drive progress in every industry.
          </Text>
          <Button
            size="md"
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
          >
            Learn More
          </Button>
        </Stack>

        <Divider my="xl" />

        {/* Mission & Vision */}
        <Grid gutter="xl" mb="xl">
          <Grid.Col m={6}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3}>Our Mission</Title>
              <Text mt="sm">
                To deliver cutting-edge technology solutions that help
                businesses thrive and stay ahead in a rapidly changing digital
                world.
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col m={6}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3}>Our Vision</Title>
              <Text mt="sm">
                To be the leading tech partner for companies worldwide, driving
                innovation, efficiency, and growth through software excellence.
              </Text>
            </Card>
          </Grid.Col>
        </Grid>

        <Divider my="xl" />

        {/* Team Section */}
        <Stack gap="md">
          <Title order={2}>Meet Our Team</Title>
          <Text c="dimmed" size="md" maw={600} mx="auto">
            A group of passionate engineers, designers, and strategists
            committed to building exceptional digital experiences.
          </Text>

          <Grid gutter="xl" justify="center" mt="md">
            {[
              { name: "Alice Johnson", role: "CEO", avatar: "" },
              { name: "Bob Smith", role: "CTO", avatar: "" },
              { name: "Clara Lee", role: "Lead Designer", avatar: "" },
              { name: "David Kim", role: "Engineer", avatar: "" },
            ].map((member, idx) => (
              <Grid.Col span={12} m={3} key={idx}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Stack align="center" gap="sm">
                    <Avatar
                      size={80}
                      radius="xl"
                      src={member.avatar}
                      alt={member.name}
                    />
                    <Text fw={500}>{member.name}</Text>
                    <Text c="dimmed" size="sm">
                      {member.role}
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>

        <Divider my="xl" />

        {/* Closing Section */}
        <Box mt="xl">
          <Title order={3}>Join Us in Shaping the Future</Title>
          <Text c="dimmed" mt="sm" mb="md">
            Whether you're a client, partner, or future team member, we are
            always looking for passionate people to grow with us.
          </Text>
          <Button variant="outline" size="md">
            Contact Us
          </Button>
        </Box>
      </Container>

      <Footer />
    </>
  );
}
