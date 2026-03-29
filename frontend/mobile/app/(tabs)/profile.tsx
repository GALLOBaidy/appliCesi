import { View, Text, Button, ScrollView } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { useEffect, useState } from "react";
import { getMyResult } from "../../src/api/routes";
import { FEELINGS } from "../../src/types/feelings";
import { UserExercice } from "../../src/types/UserExercices";

export default function Profile() {
  const { user, logout } = useAuth();
  const [results, setResults] = useState<UserExercice[]>([]);

  // Charger l'historique du user
  useEffect(() => {
    async function load() {
      const res = await getMyResult();
      setResults(res.data);
    }
    if (user) {
      load();
    }
  }, [user]);

  // Si pas connecté → écran invité
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
    <View style={{ flex: 1, padding: 20 }}>
      {/* Header */}
      <Text style={{ fontSize: 24, fontWeight: "700", textAlign: "center" }}>
        Bienvenue {user.firstName}
      </Text>

      {/* Boutons */}
      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Button title="Se déconnecter" color="#E74C3C" onPress={handleLogout} />
      </View>

      {/* Historique */}
      <Text
        style={{
          marginTop: 30,
          fontSize: 20,
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        Historique de mes exercices
      </Text>

      <ScrollView style={{ marginTop: 20 }}>
        {results.length === 0 && (
          <Text style={{ textAlign: "center", color: "#666" }}>
            Aucun exercice enregistré pour le moment.
          </Text>
        )}

        {results.map((r) => {
          const feelingInfo = FEELINGS.find((f) => f.value === r.feeling);

          return (
            <View
              key={r.id}
              style={{
                padding: 15,
                backgroundColor: "#f4f4f4",
                borderRadius: 10,
                marginBottom: 15,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "600" }}>
                Exercice #{r.exerciceId}
              </Text>

              <Text style={{ marginTop: 5 }}>
                Ressenti :{" "}
                <Text style={{ fontWeight: "700", color: feelingInfo?.color }}>
                  {feelingInfo?.label}
                </Text>
              </Text>

              <Text style={{ marginTop: 5, color: "#666" }}>
                Fait le : {new Date(r.dateCompletion).toLocaleDateString()}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
