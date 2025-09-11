import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import { login } from "../../api/auth";
import { useUser } from "../../context/UserContext";
import { Stack, Text, Center } from "@mantine/core";
const LogInForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const { loginUser } = useUser();

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Logging in ...");
    try {
      const data = await login(username, password);

      if (!data.user) {
        setMessage("Login failed: user not returned");
        return;
      }
      loginUser(data.user);
      navigate("/chat");
    } catch (error) {
      console.error("Login Error", error);
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Error Logging in");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center style={{ width: "100%" }}>
      <Stack align="center">
        <Text size="xl" fw={700} c="primary">
          <Text component="span" c="var(--mantine-color-text-primary)">
            Log In
          </Text>
        </Text>

        <>
          <AuthForm
            isLogin={true}
            username={username}
            password={password}
            onChange={handleChange}
            onSubmit={handleLogin}
          />
          {message && (
            <Text c="red" mt="sm">
              {message}
            </Text>
          )}
        </>
      </Stack>
    </Center>
  );
};

export default LogInForm;
