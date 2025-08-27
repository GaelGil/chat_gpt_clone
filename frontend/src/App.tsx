import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Layout/Footer";
import Navigation from "./components/Layout/NavBar";
import Home from "./pages/Home";
import AuthPage from "./pages/Auth";
import ProfilePage from "./pages/Profile";
import ChatPage from "./pages/Chat";
import { useEffect } from "react";
import { getCurrentUser } from "./api/auth";
import { useUser } from "./context/UserContext";

function App() {
  const { setUser } = useUser();

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/chat" element={<ChatPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/profile/:userId" element={<ProfilePage />} />
          </Route>
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
