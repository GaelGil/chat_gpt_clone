import React, { useState } from "react";
import LogInForm from "../components/Auth/LoginForm";
import SignUpForm from "../components/Auth/SignUpForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Text, Group, Stack } from "@mantine/core";
const AuthPage: React.FC = () => {
  const [selected, setSelected] = useState<"login" | "signup">("login"); // declare the default state as string
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log("No user found, stay on auth page");
    }
  }, [navigate]);

  return (
    <Stack align="center" mt="xl" mih={"100vh"} p={"xl"} m={0}>
      {selected === "login" ? <LogInForm /> : <SignUpForm />}

      <Group>
        {selected === "login" ? (
          <>
            <Text c="dimmed">Don't have an account yet?</Text>
            <Text
              variant="link"
              component="span"
              onClick={() => setSelected("signup")}
              style={{ cursor: "pointer" }}
            >
              Sign Up
            </Text>
          </>
        ) : (
          <>
            <Text c="dimmed">Already have an account?</Text>
            <Text
              variant="link"
              component="span"
              onClick={() => setSelected("login")}
              style={{ cursor: "pointer" }}
            >
              Log In
            </Text>
          </>
        )}
      </Group>
    </Stack>
  );
};

export default AuthPage;
