import { Stack, useRouter, useSegments, Href } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../../src/context/AuthContext";

export default function UserLayout() {
  const { user, setRedirectAfterLogin } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!user) {
      const currentPath = "/" + segments.join("/");
      setRedirectAfterLogin(currentPath as Href);
      router.replace("/login");
    }
  }, [user]);

  return <Stack />;
}
