import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const api = axios.create({
  baseURL: "http://172.20.10.2:3000", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajouter le token à chaque requête
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gérer les erreurs (ex: token expiré)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("userToken");
      // Ici tu ne peux PAS rediriger directement
      // Tu laisseras ton AuthContext gérer la déconnexion
    }
    throw error;
  }
);
