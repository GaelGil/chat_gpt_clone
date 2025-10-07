import { Container, Title, Tabs } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

import Appearance from "@/components/UserSettings/Appearance";
import ChangePassword from "@/components/UserSettings/ChangePassword";
import DeleteAccount from "@/components/UserSettings/DeleteAccount";
import UserInformation from "@/components/UserSettings/UserInformation";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { FaEye, FaLock, FaUser, FaSun } from "react-icons/fa";

const tabsConfig = [
  {
    value: "my-profile",
    title: "My profile",
    component: UserInformation,
    icon: <FaUser />,
  },
  {
    value: "password",
    title: "Password",
    component: ChangePassword,
    icon: <FaLock />,
  },
  {
    value: "appearance",
    title: "Appearance",
    component: Appearance,
    icon: <FaSun />,
  },
  {
    value: "danger-zone",
    title: "Danger zone",
    component: DeleteAccount,
    icon: <FaEye />,
  },
];

export const Route = createFileRoute("/dashboard/settings")({
  component: UserSettings,
});

function UserSettings() {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string | null>("my-profile");

  const finalTabs = currentUser?.is_superuser
    ? tabsConfig.slice(0, 3)
    : tabsConfig;

  if (!currentUser) {
    return null;
  }

  return (
    <Container maw="full">
      <Title size="lg" pt={12} py={12}>
        User Settings
      </Title>

      <Tabs defaultValue="my-profile" onChange={setActiveTab} variant="subtle">
        <Tabs.List>
          {finalTabs.map((tab) => (
            <Tabs.Tab
              leftSection={tab.icon}
              key={tab.value}
              value={tab.value}
              fw={activeTab === tab.value ? "800" : "normal"}
              size="xl"
            >
              {tab.title}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {finalTabs.map((tab) => (
          <Tabs.Panel key={tab.value} value={tab.value} pt="sm">
            <tab.component />
          </Tabs.Panel>
        ))}
      </Tabs>
    </Container>
  );
}
