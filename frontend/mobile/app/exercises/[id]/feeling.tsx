import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

export default function FeelingScreen() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>
        Comment te sens‑tu ?
      </Text>

      <Text style={{ marginTop: 10, color: "#666" }}>
        Choisis ton ressenti après l’exercice.
      </Text>

      <View style={{ marginTop: 40 }}>
        <TouchableOpacity
          onPress={() => router.push(`/exercises/${id}/save?feeling=bien`)}
          style={{
            backgroundColor: "#2ECC71",
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
          }}
        >
          <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
            Je me sens bien
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/exercises/${id}/save?feeling=neutre`)}
          style={{
            backgroundColor: "#F1C40F",
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
          }}
        >
          <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
            Neutre
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/exercises/${id}/save?feeling=stresse`)}
          style={{
            backgroundColor: "#E74C3C",
            padding: 15,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
            Stressé
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
