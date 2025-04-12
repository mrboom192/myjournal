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
import challenges from "@/assets/data/challenges.json";
import {
  addDoc,
  collection,
  doc,
  runTransaction,
  setDoc,
  Timestamp,
} from "firebase/firestore";

const JournalEntryScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Get params if editing an existing entry
  const isEditMode = params.mode === "edit";
  const paramTitle = params.title
    ? decodeURIComponent(params.title as string)
    : "";
  const paramContent = params.content
    ? decodeURIComponent(params.content as string)
    : "";
  const challengeId = params.challengeId as string;
  const isChallenge = !!challengeId;

  const [title, setTitle] = useState(paramTitle);
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

  const userId = auth.currentUser?.uid;
  if (!userId) return; // Exit if user is not authenticated

  const handleSave = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const userRef = doc(db, "users", userId);
    const entriesRef = collection(db, "entries");

    try {
      await runTransaction(db, async (transaction) => {
        // read
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw new Error("User does not exist!");
        }

        const currentPoints = userDoc.data()?.points || 0;

        // from challenges json
        const challengePoints = isChallenge
          ? challenges.find((c) => c.id === challengeId)?.points || 1
          : 1;

        const entryRef = doc(entriesRef); // auto-ID
        const entry = {
          userId,
          title,
          content,
          createdAt: Timestamp.now(),
          ...(isChallenge ? { challengeId } : {}),
        };

        // Now safe to write
        transaction.set(entryRef, entry);
        transaction.update(userRef, {
          points: currentPoints + challengePoints,
        });
      });

      router.back();
    } catch (error) {
      console.error("Transaction failed: ", error);
    }
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
                      challenges.find((c) => c.id === challengeId)?.color ||
                      "#9C27B0"
                    }20`,
                  },
                ]}
              >
                <Ionicons
                  name={
                    (challenges.find((c) => c.id === challengeId)
                      ?.icon as any) || "create-outline"
                  }
                  size={16}
                  color={
                    challenges.find((c) => c.id === challengeId)?.color ||
                    "#9C27B0"
                  }
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
            editable={isEditMode}
          />

          <Text style={styles.dateText}>{formattedDate}</Text>

          <View style={styles.divider} />

          <TextInput
            style={styles.contentInput}
            placeholder="Write your thoughts here..."
            placeholderTextColor="#9b9a9e"
            value={content}
            onChangeText={setContent}
            editable={isEditMode}
            multiline
            textAlignVertical="top"
            autoFocus={!isEditMode}
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
