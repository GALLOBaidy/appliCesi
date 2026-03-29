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
import { User } from "../types/User";

interface AuthContextType {
  user: User | null;
  guestId: string | null;
  login: (userData: User, token: string) => Promise<void>;
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
  const [guestId, setGuestId] = useState<string | null>(null);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<Href | null>(
    null,
  );

  // Charger le user au démarrage
  useEffect(() => {
    const loadUser = async () => {
      const stored = await SecureStore.getItemAsync("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    };
    loadUser();
  }, []);

  // Générer un guestId si pas connecté
  useEffect(() => {
    if (!user && !guestId) {
      const newGuest = "guest_" + Math.random().toString(36).substring(2, 10);
      setGuestId(newGuest);
    }
  }, [user, guestId]);

  // Login
  const login = async (userData: User, token: string): Promise<void> => {
    setUser(userData);
    await SecureStore.setItemAsync("user", JSON.stringify(userData));
    await SecureStore.setItemAsync("userToken", token);
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
    } catch (e) {
      console.log("Erreur logout backend:", e);
    }

    setUser(null);
    setRedirectAfterLogin(null);
    await SecureStore.deleteItemAsync("user");
    await SecureStore.deleteItemAsync("userToken");
  };

  // Valeur du contexte
  const value = useMemo(
    () => ({
      user,
      guestId,
      login,
      logout,
      redirectAfterLogin,
      setRedirectAfterLogin,
    }),
    [user, guestId, redirectAfterLogin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
