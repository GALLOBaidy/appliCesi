import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter, Href } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { loginUser, saveOneResult } from "../../src/api/routes";

export default function Login() {
  const router = useRouter();
  const { login, redirectAfterLogin } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);

    // Vérification des champs vides
    if (!identifier.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);

    try {
      // Appel API
      const res = await loginUser(identifier, password);

      // Le backend renvoie : { user, token }
      const { user, token } = res.data;

      // Vérifier si le compte est actif
      if (!user.isActive) {
        setError("Votre compte n'est pas actif");
        setLoading(false);
        return;
      }

      // Connexion + stockage du token
      await login(user, token);

      const pending = JSON.parse(
        (await AsyncStorage.getItem("pendingResults")) || "[]",
      );

      if (pending.length > 0) {
        try {
          for (const r of pending) {
            await saveOneResult(r);
          }
          await AsyncStorage.removeItem("pendingResults");
        } catch (e) {
          console.log("Erreur en envoyant les pendingResults :", e);
          // On garde pendingResults pour réessayer plus tard
        }
      }
      // Redirection
      if (redirectAfterLogin) {
        router.replace(redirectAfterLogin);
      } else {
        router.replace("/(tabs)/profile" as Href);
      }
    } catch (err: any) {
      console.log("Erreur login:", err?.response?.data || err?.message);

      if (err?.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError("Erreur lors de la connexion");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Bouton retour */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Email ou identifiant"
        placeholderTextColor="#aaa"
        value={identifier}
        onChangeText={(text) => {
          setIdentifier(text);
          setError(null);
        }}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError(null);
        }}
      />

      {error !== null && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Connexion..." : "Se connecter"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>Créer un compte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#e9e2e2",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#727171",
    padding: 14,
    borderRadius: 8,
    color: "white",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  link: {
    color: "#4A90E2",
    textAlign: "center",
    marginTop: 20,
    fontSize: 15,
  },
  error: {
    color: "#ff6b6b",
    marginBottom: 10,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  backText: {
    color: "#4A90E2",
    fontSize: 18,
  },
});
