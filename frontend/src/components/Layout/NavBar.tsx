import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { PROJECT_NAME } from "../../data/ProjectName";
import { PROJECT_LOGO } from "../../data/ProjectLogo";
import { useUser } from "../../context/UserContext";
import { logout } from "../../api/auth";
import { Anchor, Text, Group, Space, Button } from "@mantine/core";

const Navigation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>();
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useUser();

  const handleLogout = async () => {
    localStorage.removeItem("token");
    try {
      setLoading(true);
      await logout();
      setUser(null);
    } catch (error) {
      alert(`error logging out: ${error}`);
    } finally {
      setLoading(false);
    }
    console.log(loading);
    navigate("/login");
  };

  return (
    <Group
      align="center"
      justify="space-between"
      px="md"
      py="sm"
      style={{ maxWidth: 1200, margin: "0 auto" }}
    >
      <Anchor
        component={Link}
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
        }}
        underline="never"
      >
        <img
          src={PROJECT_LOGO}
          alt="Logo"
          className="w-24 h-12 object-contain"
        />
        <Text
          c="brand.0"
          style={{
            fontWeight: 700, // bold
            marginLeft: 8, // spacing from logo
            fontSize: "1.5rem",
          }}
        >
          {PROJECT_NAME}
        </Text>
      </Anchor>
      <Space />

      {/* Desktop nav */}
      <Group align="center" gap="md">
        {!user ? (
          <></>
        ) : (
          <Anchor
            component={Link}
            to="/chat"
            style={{
              display: "flex",
              alignItems: "center",
            }}
            underline="never"
          >
            <Button
              variant="outline" // gives border only
              radius="xl" // makes it oval
              size="sm" // adjust size
              px={20} // horizontal padding
              styles={(theme) => ({
                root: {
                  borderColor: theme.colors.brand[0], // border color
                  color: theme.colors.brand[0], // text color
                  "&:hover": {
                    backgroundColor: theme.colors.brand[0],
                    color: "white",
                  },
                },
              })}
            >
              Chat
            </Button>
          </Anchor>
        )}

        {!user ? (
          <Anchor
            component={Link}
            to="/login"
            style={{
              display: "flex",
              alignItems: "center",
            }}
            underline="never"
          >
            <Button
              variant="outline" // gives border only
              radius="xl" // makes it oval
              size="sm" // adjust size
              px={20} // horizontal padding
              styles={(theme) => ({
                root: {
                  borderColor: theme.colors.brand[0], // border color
                  color: theme.colors.brand[0], // text color
                  "&:hover": {
                    backgroundColor: theme.colors.brand[0],
                    color: "white",
                  },
                },
              })}
            >
              Log In
            </Button>
          </Anchor>
        ) : (
          <Anchor
            component={Link}
            className="text-decoration-none "
            onClick={handleLogout}
            to="/"
            underline="never"
          >
            <Button
              variant="outline" // gives border only
              radius="xl" // makes it oval
              size="sm" // adjust size
              px={20} // horizontal padding
              styles={(theme) => ({
                root: {
                  borderColor: theme.colors.brand[0], // border color
                  color: theme.colors.brand[0], // text color
                  "&:hover": {
                    backgroundColor: theme.colors.brand[0],
                    color: "white",
                  },
                },
              })}
            >
              Log Out
            </Button>
          </Anchor>
        )}
      </Group>

      {/* Mobile menu toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      >
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile nav */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 font-semibold text-lg">
          <Anchor
            component={Link}
            className="text-decoration-none "
            onClick={handleLogout}
            to="/chat"
            underline="never"
          >
            <Text c="brand.0" style={{ padding: "0.5rem 1rem" }}>
              Chat
            </Text>
          </Anchor>
        </div>
      )}
    </Group>
  );
};

export default Navigation;
