import { AppShell } from "@mantine/core";
import HomeBanner from "../components/Home/HomeBanner";
import Footer from "../components/Layout/Footer";
import Navigation from "../components/Layout/NavBar";

const HomePage: React.FC = () => {
  return (
    <AppShell bg={"var(--mantine-color-background)"}>
      <AppShell.Header
        withBorder={false}
        bg={"var(--mantine-color-background)"}
      >
        <Navigation />
      </AppShell.Header>
      <AppShell.Main>
        <HomeBanner />
      </AppShell.Main>
      <AppShell.Footer
        withBorder={false}
        bg={"var(--mantine-color-background)"}
      >
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
};

export default HomePage;
