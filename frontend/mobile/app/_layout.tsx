import { Stack, Redirect } from "expo-router";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  const theme = useColorScheme();
  return (
    <>
      <StatusBar style={theme === "light" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
      <Redirect href="/(tabs)/home" />
    </>
  );
}
