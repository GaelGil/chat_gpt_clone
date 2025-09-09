export type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  pfp?: string;
};

export type UserContextType = {
  user: User | null;
  loading: boolean;
  loginUser: (user: User) => void;
  logoutUser: () => void;
};
