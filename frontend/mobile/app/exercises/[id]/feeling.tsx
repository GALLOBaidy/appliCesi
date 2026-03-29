import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useAuth } from "../../../src/context/AuthContext";
import { FEELINGS } from "../../../src/types/feelings";

export default function FeelingScreen() {
  const { id } = useLocalSearchParams();
  const { user, /*guestId*/ } = useAuth();

  const handleFeelingSelect = (feeling: any) => {
    // Si pas connecté → redirection vers login
    if (!user) {
      router.push(
        `/login?redirect=/exercises/${id}/save&feeling=${feeling}
        `,
        // &guest=${guestId}
      );
      return;
    }

    // Si connecté → enregistrement direct
    router.push(`/exercises/${id}/save?feeling=${feeling}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>
        Comment te sens‑tu ?
      </Text>

      <Text style={{ marginTop: 10, color: "#666" }}>
        Choisis ton ressenti après l’exercice.
      </Text>

      <View style={{ marginTop: 40 }}>
        {FEELINGS.map((f) => (
          <TouchableOpacity
            key={f.value}
            onPress={() => handleFeelingSelect(f.value)}
            style={{
              backgroundColor: f.color,
              padding: 15,
              borderRadius: 10,
              marginBottom: 15,
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
