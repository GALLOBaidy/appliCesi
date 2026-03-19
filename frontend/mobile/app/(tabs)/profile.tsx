import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function Profile() {
  const user = null; // plus tard tu mettras ton vrai user

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Vous n'êtes pas connecté</Text>
        <Button title="Se connecter" onPress={() => router.push("/(public)/login")} />
        <Button title="Créer un compte" onPress={() => router.push("/(public)/register")} />
      </View>
    );
  }

  return (
    <View>
      {/* <Text>Bienvenue {user.name}</Text> */}
      <Button title="Voir mon historique" onPress={() => router.push("/(user)/history")} />
    </View>
  );
}
