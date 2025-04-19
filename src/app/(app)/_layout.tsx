import { Redirect, Stack } from "expo-router";
import { useSession } from "@/src/contexts/AuthContext";
import { auth } from "@/firebaseConfig.js";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import i18n from "@/src/locales";
import { useUser } from "@/src/contexts/UserContext";

export default function AppLayout() {
  const { signOut, session, isLoading } = useSession();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const { data, loading } = useUser();

  // Set language
  useEffect(() => {
    i18n.locale = data?.locale ?? "en";
  }, [data?.locale]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // You can keep the splash screen open, or render a nothing like we do here.
  if (isLoading || !isAuthReady || loading) {
    return null;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session || !auth.currentUser) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    signOut();
    return <Redirect href="/login" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Stack screenOptions={{ navigationBarColor: "#FFF" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)/friends"
        options={{
          presentation: "modal",
          title: "Friends",
        }}
      />
      <Stack.Screen
        name="(modals)/add-collection"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="(modals)/journal-entry"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
