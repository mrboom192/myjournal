import { Tabs } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, StyleSheet, View } from "react-native";
import { useColorScheme } from "@/src/components/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function TabLayout(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const router = useRouter();

  // Use theme colors for tab bar
  const activeColor = colorScheme === "dark" ? "#FFFFFF" : "#007AFF";
  const inactiveColor = colorScheme === "dark" ? "#8E8E93" : "#8E8E93";
  const backgroundColor = colorScheme === "dark" ? "#1C1C1E" : "#FFFFFF";
  
  // Function to handle new journal entry
  const handleNewJournal = () => {
    router.push("/(app)/(modals)/journal-entry");
  };

  return (
    <>
      {/* Custom Floating Button for New Journal Entry */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={handleNewJournal}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
      
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: inactiveColor,
          tabBarStyle: { 
            backgroundColor,
            height: 60,
            paddingBottom: 8,
          },
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
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#9C27B0', // Purple color to match the prompt card
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 25, // Position above the tab bar
    left: '50%',
    marginLeft: -28, // Half of the width to center it
    zIndex: 999, // Ensure it's above other elements
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});
