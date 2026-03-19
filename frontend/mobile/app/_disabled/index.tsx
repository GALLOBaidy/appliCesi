import { Text, View } from "react-native";

export default function DisabledPage() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Votre compte a été désactivé
      </Text>
      <Text style={{ marginTop: 10 }}>
        Merci de patienter ou contactez le support.
      </Text>
    </View>
  );
}
