import AsyncStorage from "@react-native-async-storage/async-storage";
import { getGuestId } from "../utils/guest";
import { saveOneResult } from "../api/routes";

export const saveResultInProfile = async (payload: any) => {
  const token = await AsyncStorage.getItem("token");

  if (!token) {
    // MODE INVITÉ
    const guestId = await getGuestId();

    console.log(payload);
    return saveOneResult({
      ...payload,
      guestId,
    });
    
  }

  // MODE CONNECTÉ
  return saveOneResult({
    ...payload,
    guestId: null,
  });
};
