import { View, Text, Button } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Vous n'êtes pas connecté</Text>
        <Button
          title="Se connecter"
          onPress={() => router.push("/(public)/login")}
        />
        <Button
          title="Créer un compte"
          onPress={() => router.push("/(public)/register")}
        />
      </View>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.replace("/(tabs)/home");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Bienvenue {user.firstName}
      </Text>

      <Button
        title="Voir mon historique"
        onPress={() => router.push("/(user)/history")}
      />
      <View style={{ marginTop: 30 }}>
        <Button title="Se déconnecter" color="#E74C3C" onPress={handleLogout} />
      </View>
    </View>
  );
}
