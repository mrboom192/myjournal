import { Tabs } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, StyleSheet, View } from "react-native";
import { useColorScheme } from "@/src/components/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import HomeHeader from "@/src/components/HomeHeader";
import { TabBar } from "@/src/components/TabBar/TabBar";

export default function TabLayout(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const router = useRouter();

  // Use theme colors for tab bar
  const activeColor = "#FFFFFF";
  const inactiveColor = "#8E8E93";
  const backgroundColor = "#1C1C1E";

  return (
    <>
      {/* Custom Floating Button for New Journal Entry */}

      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: inactiveColor,
          tabBarStyle: {
            backgroundColor,
            height: 60,
            paddingBottom: 8,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "home",
            header: () => <HomeHeader />,
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "profile",
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  );
}
