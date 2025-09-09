export type User = {
  id: string;
  name: string;
  email: string;
};

export type UserContextType = {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
};
