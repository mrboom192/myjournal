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
  Alert,
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
  deleteDoc,
} from "firebase/firestore";

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

const getOrdinalNum = (n) => {
  return n + (n > 0 ? ["th", "st", "nd", "rd"][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : "");
};

const JournalEntryScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Get params if editing an existing entry
  const isEditMode = params.mode === "edit";
  const isReadMode = params.mode === "read";
  const paramTitle = params.title
    ? decodeURIComponent(params.title as string)
    : "";
  const paramContent = params.content
    ? decodeURIComponent(params.content as string)
    : "";
  const challengeId = params.challengeId as string;
  const isChallenge = !!challengeId;
  const entryId = params.id as string;

  const [title, setTitle] = useState(paramTitle);
  const [content, setContent] = useState("");
  const currentDate = new Date();

  // Initialize with params data if in edit mode
  useEffect(() => {
    setTitle(paramTitle);
    setContent(paramContent);
  }, [paramTitle, paramContent]);

  const formattedDate = `Created on ${
    months[currentDate.getMonth()]
  } ${getOrdinalNum(currentDate.getDate())}, ${currentDate.getFullYear()}`;

  const userId = auth.currentUser?.uid;
  if (!userId) return null;

  const handleDelete = () => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this entry? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (!entryId) return;
              
              const entryRef = doc(db, "entries", entryId);
              await deleteDoc(entryRef);
              
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.back();
            } catch (error) {
              console.error("Error deleting entry:", error);
              Alert.alert("Error", "Failed to delete entry. Please try again.");
            }
          }
        }
      ]
    );
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    try {
      const entryData = {
        title: title.trim(),
        content,
        userId,
        updatedAt: Timestamp.now(),
        challengeId: challengeId || null,
      };

      if (entryId) {
        // Update existing entry
        const entryRef = doc(db, "entries", entryId);
        await setDoc(entryRef, {
          ...entryData,
          createdAt: Timestamp.now(), // Keep original creation date
        }, { merge: true });
      } else {
        // Create new entry
        const entriesRef = collection(db, "entries");
        await addDoc(entriesRef, {
          ...entryData,
          createdAt: Timestamp.now(),
        });

        // If this is a challenge entry, update user points
        if (challengeId) {
          const challenge = challenges.find(c => c.id === challengeId);
          if (challenge) {
            const userRef = doc(db, "users", userId);
            await runTransaction(db, async (transaction) => {
              const userDoc = await transaction.get(userRef);
              if (!userDoc.exists()) return;
              
              const currentPoints = userDoc.data().points || 0;
              transaction.update(userRef, {
                points: currentPoints + challenge.points
              });
            });
          }
        }
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      console.error("Error saving entry:", error);
      Alert.alert("Error", "Failed to save entry. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          {isReadMode && (
            <TouchableOpacity
              style={[styles.headerButton, { marginRight: 8 }]}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={24} color="#ff4444" />
            </TouchableOpacity>
          )}
          {!isReadMode && (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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
            editable={!isReadMode}
          />

          <Text style={styles.dateText}>{formattedDate}</Text>

          <View style={styles.divider} />

          <TextInput
            style={styles.contentInput}
            placeholder="Write your thoughts here..."
            placeholderTextColor="#9b9a9e"
            value={content}
            onChangeText={setContent}
            editable={!isReadMode}
            multiline
            textAlignVertical="top"
            autoFocus={isEditMode && !entryId}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
    paddingVertical: 10,
  },
  headerButton: {
    padding: 8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  challengeBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  challengeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  challengeBadgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    padding: 0,
  },
  dateText: {
    color: "#9b9a9e",
    fontSize: 14,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#2a2933",
    marginBottom: 16,
  },
  contentInput: {
    fontSize: 16,
    color: "#fff",
    lineHeight: 24,
    minHeight: 200,
    padding: 0,
  },
});

export default JournalEntryScreen;
