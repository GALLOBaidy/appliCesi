import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { createUser, saveOneResult } from "../../src/api/routes";
import { User } from "../../src/types/User";

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);

    // Vérification des champs vides
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !loginName.trim() ||
      !password.trim()
    ) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    try {
      const payload = {
        firstName,
        lastName,
        email,
        login: loginName,
        password,
      };

      const response = await createUser(payload);
      const data = response.data as { user: User; token: string };

      // Connexion automatique après inscription
      await login(data.user, data.token);

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
      router.replace("/(tabs)/profile");
    } catch (e: any) {
      console.log("Erreur API:", e.response?.data);

      if (e.response?.data?.error) {
        setError(e.response.data.error); // message backend affiché tel quel
      } else {
        setError("Erreur lors de l'inscription");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* 🔙 Bouton retour */}
        <TouchableOpacity style={styles.backButton} onPress={router.back}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Créer un compte</Text>

        <TextInput
          style={styles.input}
          placeholder="Prénom"
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={lastName}
          onChangeText={setLastName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Identifiant"
          value={loginName}
          onChangeText={setLoginName}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 80,
    backgroundColor: "#e9e2e2",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backText: {
    color: "#4A90E2",
    fontSize: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#727171",
    padding: 14,
    borderRadius: 8,
    color: "white",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
