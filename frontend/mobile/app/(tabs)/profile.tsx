import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { useEffect, useState } from "react";
import { getMyResult, deleteOneResult } from "../../src/api/routes";
import { FEELINGS } from "../../src/types/feelings";
import { UserExercice } from "../../src/types/UserExercices";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const { user, logout } = useAuth();
  const [results, setResults] = useState<UserExercice[]>([]);
  const [toDelete, setToDelete] = useState<number | null>(null);

  // Charger l'historique du user à l'ouverture du profil
  useEffect(() => {
    async function load() {
      const res = await getMyResult();
      setResults(res.data);
    }
    if (user) load();
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

  const renderItem = ({ item }: { item: UserExercice }) => {
    const feelingInfo = FEELINGS.find((f) => f.value === item.feeling);

    return (
      <View
        style={{
          padding: 15,
          backgroundColor: "#f4f4f4",
          borderRadius: 10,
          marginBottom: 15,
          position: "relative",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            Exercice "{item.exerciceTitle}"
          </Text>

          <Text style={{ marginTop: 5 }}>
            Ressenti :{" "}
            <Text style={{ fontWeight: "700", color: feelingInfo?.color }}>
              {feelingInfo?.label}
            </Text>
          </Text>

          <Text style={{ marginTop: 5, color: "#666" }}>
            Fait le : {new Date(item.dateCompletion).toLocaleDateString()}
          </Text>
        </View>

        {/* Bouton supprimer */}
        <Pressable
          onPress={() => setToDelete(item.id)}
          hitSlop={20}
          android_disableSound={true}
          style={{
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 18 }}>🗑️ </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", textAlign: "center" }}>
        Bienvenue {user.firstName}
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/(user)/Profil")}
        style={{ position: "absolute", top: 40, right: 20 }}
      >
        <Ionicons name="person-circle-outline" size={28} color="#4A90E2" />
      </TouchableOpacity>

      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Button title="Se déconnecter" color="#E74C3C" onPress={handleLogout} />
      </View>

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

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 20 }}
        removeClippedSubviews={false}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#666" }}>
            Aucun exercice enregistré pour le moment.
          </Text>
        }
      />

      {/* MODAL SUPPRESSION */}
      {toDelete !== null && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: "80%",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 20 }}>
              Supprimer ce résultat ?
            </Text>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                onPress={async () => setToDelete(null)}
                style={{
                  padding: 10,
                  backgroundColor: "#ccc",
                  borderRadius: 8,
                  width: "45%",
                }}
              >
                <Text style={{ textAlign: "center" }}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  await deleteOneResult(toDelete);
                  setResults((prev) => prev.filter((r) => r.id !== toDelete));
                  setToDelete(null);

                  Toast.show({
                    type: "success",
                    text1: "Résultat supprimé",
                    text2: "Le résultat a bien été retiré de votre historique",
                  });
                }}
                style={{
                  padding: 10,
                  backgroundColor: "#E74C3C",
                  borderRadius: 8,
                  width: "45%",
                }}
              >
                <Text style={{ textAlign: "center", color: "white" }}>
                  Supprimer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
