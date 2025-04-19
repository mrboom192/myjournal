import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LanguageProvider } from "@/src/contexts/LanguageContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SignUpProvider } from "../contexts/SignupContext";
import { SessionProvider } from "../contexts/AuthContext";
import { UserProvider } from "../contexts/UserContext";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { useEffect } from "react";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { StatusBar } from "expo-status-bar";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Do not return anything until fonts are loaded
  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  // Below lets us access context state throughout the app, since _layout is top level
  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <LanguageProvider>
          <SessionProvider>
            <UserProvider>
              <SignUpProvider>
                <StatusBar style="light" />
                <Stack
                  screenOptions={{
                    navigationBarColor: "#FFF",
                    headerShown: false,
                  }}
                />
              </SignUpProvider>
            </UserProvider>
          </SessionProvider>
        </LanguageProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
