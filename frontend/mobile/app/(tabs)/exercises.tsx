import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, FlatList, View } from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { getAllGames } from "../../src/api/routes";

export default function ExercisesList() {
  const [games, setGames] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const response = await getAllGames();
      setGames(response.data);
    }
    load();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f7f7" }} edges={["left", "right", "bottom"]}>
      {/* 🔥 ENTÊTE */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          paddingTop: 5, 
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: "700" }}>
          Exercices
        </Text>
        <Text style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
          Choisis un exercice pour commencer
        </Text>
      </View>

      {/* 📋 LISTE */}
      <FlatList
        data={games}
        keyExtractor={(item) => item.exerciceId.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/exercises/${item.exerciceId}`)}
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 16,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 3 },
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 6 }}>
              {item.title}
            </Text>

            {item.description && (
              <Text style={{ fontSize: 14, color: "#666" }} numberOfLines={2}>
                {item.description}
              </Text>
            )}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
