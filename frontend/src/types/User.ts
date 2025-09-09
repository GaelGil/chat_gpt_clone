export type User = {
  id: string;
  name: string;
  email: string;
};

export type UserContextType = {
  user: User | null;
  loading: boolean;
  loginUser: (user: User) => void;
  logoutUser: () => void;
};
