import { AppShell } from "@mantine/core";
import HomeBanner from "../components/Home/HomeBanner";
import Footer from "../components/Layout/Footer";
import Navigation from "../components/Layout/NavBar";

const HomePage: React.FC = () => {
  return (
    <AppShell>
      <AppShell.Header bg="brand.7" withBorder={false}>
        <Navigation />
      </AppShell.Header>
      <AppShell.Main bg="brand.7">
        <HomeBanner />
      </AppShell.Main>
      <AppShell.Footer bg="brand.7" withBorder={false}>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
};

export default HomePage;
