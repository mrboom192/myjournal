import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { auth, db } from "@/firebaseConfig";
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";

// Maps challenge ID to color and icon
const challengeMap = {
  "1": { color: "#9C27B0", icon: "create-outline" },
  "2": { color: "#4CAF50", icon: "restaurant-outline" },
  "3": { color: "#F44336", icon: "heart-outline" },
  "4": { color: "#2196F3", icon: "film-outline" },
  "5": { color: "#FF9800", icon: "fitness-outline" },
  "6": { color: "#FFC107", icon: "trophy-outline" },
  "7": { color: "#03A9F4", icon: "airplane-outline" },
};

const JournalEntryScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Get params if editing an existing entry
  const isEditMode = params.editMode === "true";
  const paramTitle = params.title
    ? decodeURIComponent(params.title as string)
    : "";
  const paramContent = params.content
    ? decodeURIComponent(params.content as string)
    : "";
  const isChallenge = params.isChallenge === "true";
  const challengeId = params.challengeId as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const currentDate = new Date();

  // Initialize with params data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setTitle(paramTitle);
      setContent(paramContent);
    }
  }, [isEditMode, paramTitle, paramContent]);

  const formattedDate = `Created on ${
    months[currentDate.getMonth()]
  } ${getOrdinalNum(currentDate.getDate())}, ${currentDate.getFullYear()}`;

  const handleSave = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Save the journal entry logic would go here
    await addDoc(collection(db, "entries"), {
      userId: auth.currentUser?.uid,
      title,
      content,
      createdAt: Timestamp.now(),
    });

    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          {isChallenge && challengeId && (
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>{title || paramTitle}</Text>
            </View>
          )}
          <TouchableOpacity onPress={handleSave} style={styles.doneButton}>
            <Text style={styles.doneButtonText}>done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Challenge Badge (if this is a challenge entry) */}
          {isChallenge && challengeId && (
            <View style={styles.challengeBadgeContainer}>
              <View
                style={[
                  styles.challengeIconContainer,
                  {
                    backgroundColor: `${
                      (challengeMap as any)[challengeId]?.color || "#9C27B0"
                    }20`,
                  },
                ]}
              >
                <Ionicons
                  name={
                    (challengeMap as any)[challengeId]?.icon || "create-outline"
                  }
                  size={16}
                  color={(challengeMap as any)[challengeId]?.color || "#9C27B0"}
                />
              </View>
              <Text style={styles.challengeBadgeText}>Challenge Entry</Text>
            </View>
          )}

          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            placeholderTextColor="#9b9a9e"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.dateText}>{formattedDate}</Text>

          <View style={styles.divider} />

          <TextInput
            style={styles.contentInput}
            placeholder="Write your thoughts here..."
            placeholderTextColor="#9b9a9e"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            autoFocus={isChallenge}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Helper functions
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getOrdinalNum(n: number) {
  return (
    n +
    (n > 0
      ? ["th", "st", "nd", "rd"][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
      : "")
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1b22",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  backButton: {
    padding: 8,
  },
  doneButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  challengeBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  challengeIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  challengeBadgeText: {
    color: "#9b9a9e",
    fontSize: 14,
    fontWeight: "500",
  },
  titleInput: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  dateText: {
    color: "#9b9a9e",
    fontSize: 14,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#3b3946",
    marginBottom: 16,
  },
  contentInput: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
    minHeight: 300,
  },
});

export default JournalEntryScreen;
