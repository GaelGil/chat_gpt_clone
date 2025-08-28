import { AppShell } from "@mantine/core";
import HomeBanner from "../components/Home/HomeBanner";
import Footer from "../components/Layout/Footer";
import Navigation from "../components/Layout/NavBar";
import { theme } from "../theme";

const HomePage: React.FC = () => {
  return (
    <AppShell>
      <AppShell.Header style={{ backgroundColor: theme.colors.brand[4] }}>
        <Navigation />
      </AppShell.Header>
      <AppShell.Main style={{ backgroundColor: theme.colors.brand[4] }}>
        <HomeBanner />
      </AppShell.Main>
      <AppShell.Footer style={{ backgroundColor: theme.colors.brand[4] }}>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
};

export default HomePage;
