import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navigation from "./components/Layout/NavBar";
import "./css/App.css";
import Footer from "./components/Layout/Footer";

function App() {
  return (
    <>
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
