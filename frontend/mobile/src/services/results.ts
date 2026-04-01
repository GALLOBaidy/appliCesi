import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { saveOneResult } from "../api/routes";

export const saveResultInProfile = async (payload: any) => {
  const token = await SecureStore.getItemAsync("userToken");

  if (!token) {
    // MODE INVITÉ → on stocke localement
    const existing = JSON.parse(
      (await AsyncStorage.getItem("pendingResults")) || "[]",
    );

    existing.push(payload);

    await AsyncStorage.setItem("pendingResults", JSON.stringify(existing));

    return { local: true };
  }
  // MODE CONNECTÉ
  return saveOneResult({
    ...payload,
    // guestId: null,
  });
};
