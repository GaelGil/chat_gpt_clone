// import { Form } from "react-bootstrap";
import type { AuthFormProps } from "../../types/AuthFormProp.ts";
import { Button, TextInput } from "@mantine/core";
const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  username,
  password,
  email,
  onChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="p-6 space-y-4 max-w-md mx-auto">
    <TextInput
      label="Username"
      type="text"
      name="username"
      value={username}
      onChange={onChange}
      required
      placeholder="Enter Username"
    />
    {!isLogin && (
      <>
        <TextInput
          label="Email"
          type="text"
          name="email"
          value={email}
          onChange={onChange}
          required
          placeholder="Enter Email"
        />
      </>
    )}

    <TextInput
      label="Password"
      type="text"
      name="password"
      value={password}
      onChange={onChange}
      required
      placeholder="Enter password"
    />

    <Button
      type="submit"
      variant="outline" // gives border only
      radius="xl" // makes it oval
      size="lg" // adjust size
      styles={(theme) => ({
        root: {
          borderColor: theme.colors.brand[4], // border color
          color: theme.colors.brand[4], // text color
        },
      })}
    >
      {isLogin ? "Login" : "Sign Up"}
    </Button>
  </form>
);

export default AuthForm;
