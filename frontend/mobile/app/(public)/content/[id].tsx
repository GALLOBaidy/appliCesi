import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getOneContent } from "../../../src/api/routes";

export default function ContentDetail() {
  const { id } = useLocalSearchParams();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOneContent(id)
      .then((res) => setContent(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{ marginTop: 10 }}>Chargement...</Text>
      </View>
    );
  }

  if (!content) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18 }}>Contenu introuvable</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20 }}>
      <View
        style={{
          padding: 20,
          paddingTop: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 1 }}>
            ← Retour
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* TITRE */}
        <Text style={styles.title}>{content.title}</Text>

        {/* CATÉGORIE */}
        {content.category && (
          <Text style={styles.category}>Catégorie : {content.category}</Text>
        )}

        {/* CONTENU */}
        {content.body && <Text style={styles.body}>{content.body}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F7F9FC",
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 10,
    color: "#1A1A1A",
  },
  category: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#444",
    marginBottom: 20,
    lineHeight: 22,
  },
  body: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginTop: 10,
  },
});
