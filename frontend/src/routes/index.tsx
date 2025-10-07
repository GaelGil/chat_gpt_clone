// routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import HomeBanner from "../components/Common/Home/HomeBanner";
import Footer from "../components/Common/Layout/Footer";
import Navbar from "../components/Common/Layout/HomeNav";
export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Navbar />

      <HomeBanner />

      <Footer />
    </>
  );
}
