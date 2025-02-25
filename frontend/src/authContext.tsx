import { createContext, useState, ReactNode } from "react";

type User = {
  email: string;
  name: string;
};

type AuthContextInterface = {
  user: User | null;
  setCurrentUser: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextInterface>({
  user: null,
  setCurrentUser: () => {},
  logout: () => {},
});

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const setCurrentUser = (user: User) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
