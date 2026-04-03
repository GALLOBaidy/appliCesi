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
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useNavigation } from "expo-router";
import { getCurrentUser, updateProfil, deleteUser } from "../../src/api/routes";
import Toast from "react-native-toast-message";
import { ProfileForm } from "../../src/types/User";
import { useAuth } from "../../src/context/AuthContext";

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
  const [userId, setUserId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigation = useNavigation();
  const handleBack = () => router.back();
  const { logout } = useAuth();

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
      setUserId(u.userId);

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

    if (!userId) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Impossible de trouver l'identifiant utilisateur",
      });
      return;
    }

    try {
      await updateProfil(userId, form);

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

  const handleDeleteAccount = async () => {
    if (!userId) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Impossible de trouver l'identifiant utilisateur",
      });
      return;
    }

    try {
      setDeleting(true);
      await deleteUser(userId);

      // Déconnexion automatique
      await logout();

      Toast.show({
        type: "success",
        text1: "Compte supprimé",
        text2: "Votre compte a été définitivement supprimé",
      });

      router.replace("/profile"); 
    } catch (e) {
      console.log("Erreur suppression:", e);
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Impossible de supprimer le compte",
      });
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) return <Text style={{ padding: 20 }}>Chargement...</Text>;

  return (
    <>
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
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "red", marginTop: 20 }]}
              onPress={() => setShowDeleteModal(true)}
            >
              <Text style={styles.buttonText}>Supprimer mon compte</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmer la suppression</Text>
            <Text style={styles.modalText}>
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est
              irréversible.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#aaa" }]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "red" }]}
                onPress={handleDeleteAccount}
                disabled={deleting}
              >
                <Text style={styles.modalButtonText}>
                  {deleting ? "Suppression..." : "Supprimer"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 15,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
