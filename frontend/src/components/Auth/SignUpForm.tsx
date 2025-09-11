import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import { login, signup } from "../../api/auth";
import { useUser } from "../../context/UserContext"; // adjust path as needed
import { Stack, Text, Center } from "@mantine/core";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<boolean>();
  const { loginUser } = useUser();

  const navigate = useNavigate();
  // function to handle if algorithm changes
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
      case "email":
        setEmail(value);
        break;
      default:
        break;
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await signup(username, email, password);
      setMessage(data.msg);
      setMessage("Account created");
      setLoading(true);
      try {
        setMessage("Logging in ...");
        const user = await login(username, password);
        setMessage(user.msg);
        loginUser(data.user);
        // const userId = user.user.id;
        navigate("/chat");
      } catch (error) {
        setMessage("error signing up");
      } finally {
        setLoading(false);
      }
    } catch (error) {
      setMessage("error signing up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center style={{ width: "100%" }}>
      <Stack align="center">
        <Text size="xl" fw={700} c="primary">
          <Text component="span" c="var(--mantine-color-text-primary)">
            Sign Up
          </Text>
        </Text>
        <AuthForm
          isLogin={false}
          username={username}
          email={email}
          password={password}
          onChange={handleChange}
          onSubmit={handleSignUp}
        />
        {message && <p className="text-danger">{message}</p>}
      </Stack>
    </Center>
  );
};

export default SignUpForm;
