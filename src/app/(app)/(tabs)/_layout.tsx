import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";
import { useColorScheme } from "@/src/components/useColorScheme";

export default function TabLayout(): React.JSX.Element {
  const colorScheme = useColorScheme();

  // Use theme colors for tab bar
  const activeColor = colorScheme === "dark" ? "#FFFFFF" : "#007AFF";
  const inactiveColor = colorScheme === "dark" ? "#8E8E93" : "#8E8E93";
  const backgroundColor = colorScheme === "dark" ? "#1C1C1E" : "#FFFFFF";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: { backgroundColor },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("../../../../assets/images/home_button.png")}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("../../../../assets/images/account_circle_button.png")}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
