import { Tabs } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabsLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#4A90E2",
          tabBarInactiveTintColor: "#999",
          sceneStyle: { paddingTop: 40 },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Accueil",
            tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
          }}
        />

        <Tabs.Screen
          name="exercises"
          options={{
            title: "Exercices",
            tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏋️</Text>,
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profil",
            tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text>,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
