import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
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
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
