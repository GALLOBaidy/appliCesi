import { Stack } from "expo-router";

export default function DisabledLayout() {
  return <Stack screenOptions={{ headerShown: false,presentation: "modal",  }} />;
}
