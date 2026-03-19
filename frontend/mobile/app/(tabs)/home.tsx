import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import { getContents } from "../../src/api/routes";

export default function HomeScreen() {
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContents()
      .then((res: { data: any[] }) => {
        setContents(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{ marginTop: 10 }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>Bienvenue sur CESIZEN</Text>
      <Text style={styles.subtitle}>
        Explore nos contenus bien‑être et prends soin de toi.
      </Text>

      {/* LISTE DES CONTENUS */}
      <FlatList
        data={contents}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Link href={`/content/${item.id}`} asChild>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              {item.category && (
                <Text style={styles.cardCategory}>{item.category}</Text>
              )}
              <Text style={styles.cardLink}>Voir le contenu →</Text>
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40 }}>
            Aucun contenu disponible pour le moment.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F9FC",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  cardLink: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "500",
  },
});
