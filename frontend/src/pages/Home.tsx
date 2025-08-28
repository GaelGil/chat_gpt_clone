import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import HomeBanner from "../components/Home/HomeBanner";
import Footer from "../components/Layout/Footer";
import Navigation from "../components/Layout/NavBar";

const HomePage: React.FC = () => {
  const [opened] = useDisclosure(false);

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <div>
          <Navigation />
        </div>
      </AppShell.Header>

      <AppShell.Main>
        <HomeBanner />
      </AppShell.Main>

      <AppShell.Footer>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
};

export default HomePage;
