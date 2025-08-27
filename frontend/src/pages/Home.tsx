import HomeBanner from "../components/Home/HomeBanner";
import Footer from "../components/Layout/Footer";
import Navigation from "../components/Layout/NavBar";
const HomePage: React.FC = () => {
  return (
    <>
      <Navigation />

      <HomeBanner />
      <Footer />
    </>
  );
};

export default HomePage;
