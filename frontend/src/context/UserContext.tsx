import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import type { User, UserContextType } from "../types/User";
import { getCurrentUser } from "../api/auth";

// user context
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // user and setUser
  const [loading, setLoading] = useState(true); // for initial load

  // get current user on initial load
  useEffect(() => {
    getCurrentUser()
      .then((user) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const loginUser = (user: User) => setUser(user);
  const logoutUser = () => setUser(null);

  const value = useMemo(
    () => ({ user, loading, loginUser, logoutUser }),
    [user, loading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
