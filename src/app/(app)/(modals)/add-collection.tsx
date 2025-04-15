import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@/src/contexts/UserContext";
import { collection, getFirestore, addDoc } from "firebase/firestore";
import * as Haptics from "expo-haptics";

// Available icons for collections
const ICONS = [
  "journal-outline",
  "book-outline",
  "heart-outline",
  "star-outline",
  "flower-outline",
  "leaf-outline",
  "pencil-outline",
  "moon-outline",
  "sunny-outline",
  "planet-outline",
  "paw-outline",
  "musical-notes-outline",
  "camera-outline",
  "airplane-outline",
  "cafe-outline",
];

// Color options for collections
const COLORS = [
  "#9C27B0", // Purple
  "#2196F3", // Blue
  "#4CAF50", // Green
  "#FFC107", // Amber
  "#F44336", // Red
  "#FF9800", // Orange
  "#00BCD4", // Cyan
  "#795548", // Brown
  "#607D8B", // Blue Grey
  "#E91E63", // Pink
];

export default function AddCollectionModal() {
  const router = useRouter();
  const { data } = useUser();
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a collection name");
      return;
    }

    if (!data?.uid) {
      Alert.alert("Error", "You must be logged in to create a collection");
      return;
    }

    try {
      const db = getFirestore();
      const collectionsRef = collection(db, "collections");
      await addDoc(collectionsRef, {
        name: name.trim(),
        icon: selectedIcon,
        color: selectedColor,
        userId: data.uid,
        createdAt: new Date(),
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      console.error("Error creating collection:", error);
      Alert.alert("Error", "Failed to create collection. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#1c1b22" },
          headerShadowVisible: false,
          title: "New Collection",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleCreate}>
              <Text style={styles.createButton}>Create</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.content}>
        {/* Name Input */}
        <Text style={[styles.label, { marginTop: 0 }]}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Collection name"
          placeholderTextColor="#9b9a9e"
        />

        {/* Icon Selection */}
        <Text style={styles.label}>Icon</Text>
        <View style={styles.iconGrid}>
          {ICONS.map((icon) => (
            <TouchableOpacity
              key={icon}
              style={[
                styles.iconButton,
                selectedIcon === icon && {
                  backgroundColor: `${selectedColor}20`,
                },
              ]}
              onPress={() => {
                setSelectedIcon(icon);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Ionicons
                name={icon as any}
                size={24}
                color={selectedIcon === icon ? selectedColor : "#9b9a9e"}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Color Selection */}
        <Text style={styles.label}>Color</Text>
        <View style={styles.colorGrid}>
          {COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                selectedColor === color && styles.selectedColor,
              ]}
              onPress={() => {
                setSelectedColor(color);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1b22",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#2a2933",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 16,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#2a2933",
    justifyContent: "center",
    alignItems: "center",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: "#fff",
  },
  createButton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
