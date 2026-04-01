import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

export const getGuestId = async () => {
  let guestId = await AsyncStorage.getItem("guestId");

  if (!guestId) {
    guestId = uuid.v4().toString(); 
    await AsyncStorage.setItem("guestId", guestId);
  }

  return guestId;
};
