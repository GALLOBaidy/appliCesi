import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from "react";
import { Href } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { logoutUser } from "../api/routes";

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  login: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  redirectAfterLogin: Href | null;
  setRedirectAfterLogin: (path: Href | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  readonly children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<Href | null>(
    null,
  );

  //  Charger le user au démarrage
  useEffect(() => {
    const loadUser = async () => {
      const stored = await SecureStore.getItemAsync("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    };
    loadUser();
  }, []);

  //  Login + persistance
  const login = async (userData: User): Promise<void> => {
    setUser(userData);
    await SecureStore.setItemAsync("user", JSON.stringify(userData));
  };

  //  Logout backend + suppression locale
  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
    } catch (e) {
      console.log("Erreur logout backend:", e);
    }

    setUser(null);
    setRedirectAfterLogin(null);
    await SecureStore.deleteItemAsync("user");
  };

  //  Stabiliser la valeur du contexte
  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      redirectAfterLogin,
      setRedirectAfterLogin,
    }),
    [user, redirectAfterLogin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
