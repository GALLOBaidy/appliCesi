import { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useNavigation } from "expo-router";
import { getCurrentUser, updateProfil } from "../../src/api/routes";
import Toast from "react-native-toast-message";
import { ProfileForm } from "../../src/types/User";

const HeaderBackButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={{ fontSize: 18, fontWeight: "bold" }}>← Retour</Text>
  </TouchableOpacity>
);

const renderHeaderLeft = (onPress: () => void) => () => (
  <HeaderBackButton onPress={onPress} />
);

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const handleBack = () => router.back();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Profil",
      headerLeft: renderHeaderLeft(handleBack),
    });
  }, [navigation]);

  const [form, setForm] = useState<ProfileForm>({
    firstName: "",
    lastName: "",
    email: "",
    login: "",
    gender: "",
    birthDay: "",
    streetNumber: "",
    streetName: "",
    city: "",
    postalCode: "",
    country: "",
    addressComplement: "",
  });

  const handleChange = (key: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    async function load() {
      const res = await getCurrentUser();
      const u = res.data.user;

      setForm({
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        email: u.email || "",
        login: u.login || "",
        gender: u.gender || "",
        birthDay: u.birthDay || "",
        streetNumber: u.streetNumber || "",
        streetName: u.streetName || "",
        city: u.city || "",
        postalCode: u.postalCode || "",
        country: u.country || "",
        addressComplement: u.addressComplement || "",
      });

      setLoading(false);
    }
    load();
  }, []);

  const requiredFields: (keyof ProfileForm)[] = [
    "firstName",
    "lastName",
    "email",
    "login",
    "gender",
    "birthDay",
    "streetNumber",
    "streetName",
    "city",
    "postalCode",
    "country",
  ];

  const validateForm = () => {
    for (const field of requiredFields) {
      if (!form[field].trim()) {
        return `Le champ "${field}" est obligatoire`;
      }
    }
    return null;
  };

  const handleSave = async () => {
    const errorMsg = validateForm();

    if (errorMsg) {
      Toast.show({
        type: "error",
        text1: "Champs manquant",
        text2: errorMsg,
      });
      return;
    }

    try {
      await updateProfil(form);

      Toast.show({
        type: "success",
        text1: "Profil mis à jour",
        text2: "Vos informations ont bien été enregistrées",
      });

      router.back();
    } catch (e) {
      console.log("Erreur API:", e);

      Toast.show({
        type: "error",
        text1: "Erreur serveur",
        text2: "Impossible de mettre à jour le profil",
      });
    }
  };

  if (loading) return <Text style={{ padding: 20 }}>Chargement...</Text>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e9e2e2" }}>
      {/* HEADER IDENTIQUE À ContentDetail */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Modifier mes informations</Text>
      </View>

      {/* FORMULAIRE SCROLLABLE */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {Object.entries(form).map(([key, value]) => (
            <TextInput
              key={key}
              style={styles.input}
              value={value}
              onChangeText={(text) =>
                handleChange(key as keyof ProfileForm, text)
              }
              placeholder={key}
              placeholderTextColor="#aaa"
            />
          ))}

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Enregistrer</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  backText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: "#727171",
    padding: 14,
    borderRadius: 8,
    color: "white",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 40,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
