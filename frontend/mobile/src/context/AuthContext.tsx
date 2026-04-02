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
import { api } from "../api/index";

interface AuthContextType {
  user: User | null;
  token: string | null;
  guestId: string | null;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  redirectAfterLogin: Href | null;
  setRedirectAfterLogin: (path: Href | null) => void;
}

interface AuthProviderProps {
  readonly children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<Href | null>(
    null,
  );

  // Bloquer l'app tant que user + token ne sont pas chargés
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Charger user + token au démarrage
  useEffect(() => {
    async function loadAuth() {
      const storedUser = await SecureStore.getItemAsync("user");
      const storedToken = await SecureStore.getItemAsync("userToken");

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedToken) setToken(storedToken);

      setLoadingAuth(false);
    }

    loadAuth();
  }, []);

  // Injecter le token dans axios
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Générer un guestId
  useEffect(() => {
    if (!user && !guestId) {
      const newGuest = "guest_" + Math.random().toString(36).substring(2, 10);
      setGuestId(newGuest);
    }
  }, [user, guestId]);

  // Login
  const login = async (userData: User, token: string) => {
    setUser(userData);
    setToken(token);

    // Injection immédiate dans axios (évite les 401 juste après login)
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    await SecureStore.setItemAsync("user", JSON.stringify(userData));
    await SecureStore.setItemAsync("userToken", token);
  };

  // Logout
  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.log("Erreur logout backend:", e);
    }

    setUser(null);
    setToken(null);
    setRedirectAfterLogin(null);

    await SecureStore.deleteItemAsync("user");
    await SecureStore.deleteItemAsync("userToken");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      guestId,
      login,
      logout,
      redirectAfterLogin,
      setRedirectAfterLogin,
    }),
    [user, token, guestId, redirectAfterLogin],
  );

  // IMPORTANT : tant que loadingAuth est true, on ne rend rien
  if (loadingAuth) {
    return null; // ou un splash screen
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
