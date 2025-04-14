import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { SessionProvider } from "../contexts/AuthContext";

import {useColorScheme } from "@/src/components/useColorScheme";
import {SignUpProvider } from "../contexts/SignupContext";
import {UserProvider } from "../contexts/UserContext";
import {LanguageProvider} from "@/src/contexts/LanguageContext";

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
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
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

  if (!loaded) {
    return null;
  }

  return (
    <LanguageProvider> 
    <RootLayoutNav />
    </LanguageProvider> 
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  // Need to make a header function that looks good!!
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SessionProvider>
        <UserProvider>
          <SignUpProvider>
            <Stack
              screenOptions={{
                navigationBarColor: "#FFF",
                headerShown: false,
              }}
            />
          </SignUpProvider>
        </UserProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
