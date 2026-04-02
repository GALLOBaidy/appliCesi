import { Stack, Redirect } from "expo-router";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/src/context/AuthContext";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const theme = useColorScheme();
  return (
    <AuthProvider>
      <StatusBar style={theme === "light" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
      <Redirect href="/(tabs)/home" />
      <Toast />
    </AuthProvider>
  );
}
