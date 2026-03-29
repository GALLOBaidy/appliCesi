import { useLocalSearchParams, router } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../../../src/context/AuthContext";
import { saveResultInProfile } from "../../../src/services/results";

export default function SaveFeeling() {
    const { id, feeling } = useLocalSearchParams();
    const { user } = useAuth();

    useEffect(() => {
        async function save() {
            const payload = {
                exerciceId: Number(id),
                feeling, dateCompletion: new Date().toISOString(),
            };
            console.log(payload);
            
            await saveResultInProfile(payload);
            if (user) {
                router.push("/profile");
            } else {
                router.push("/guest-summary");
            }
        }

        save();
    }, []);

    return null;
}
