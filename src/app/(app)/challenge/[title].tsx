import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import * as Haptics from "expo-haptics";
import challenges from "@/assets/data/challenges.json";
import Colors from "@/src/constants/Colors";

// Fetch challenge info based on title
const getChallengeInfo = (title: string) => {
  // This is a simplified version - in a real app this would fetch from a database
  const challenge = challenges.find((c) => c.title === title);
  return challenge || challenges[0]; // Return first challenge as fallback
};

const ChallengeDetail = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const title = params.title as string;
  const challengeInfo = getChallengeInfo(title);

  const handleCreateJournal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Create a starter content based on the challenge prompts
    const promptText = challengeInfo.prompts.map((p) => `• ${p}\n`).join("\n");
    const starterContent = `${challengeInfo.description}\n\n${promptText}`;

    // Format a better title for the journal entry
    const journalTitle = `${challengeInfo.title}`;

    // Navigate to journal entry with pre-filled content
    router.push({
      pathname: "/(app)/(modals)/journal-entry",
      params: {
        title: journalTitle,
        content: starterContent,
        challengeId: challengeInfo.id,
        mode: "edit",
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Challenge Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${challengeInfo.color}20` },
          ]}
        >
          <Ionicons
            name={challengeInfo.icon as any}
            size={48}
            color={challengeInfo.color}
          />
        </View>

        {/* Points Badge */}
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>{challengeInfo.points} points</Text>
        </View>

        {/* Challenge Description */}
        <Text style={styles.description}>{challengeInfo.description}</Text>

        {/* Prompts */}
        <View style={styles.promptsContainer}>
          <Text style={styles.promptsTitle}>Prompts to help you:</Text>
          {challengeInfo.prompts.map((prompt, index) => (
            <View key={index} style={styles.promptItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.promptText}>{prompt}</Text>
            </View>
          ))}
        </View>

        {/* Write Journal Button */}
        <TouchableOpacity
          style={styles.journalButton}
          onPress={handleCreateJournal}
        >
          <Ionicons name="create" size={22} color="#fff" />
          <Text style={styles.journalButtonText}>Create Journal Entry</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  backButton: {
    padding: 8,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  pointsContainer: {
    backgroundColor: "#3b3946",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
  },
  pointsText: {
    color: "#f0883e",
    fontWeight: "bold",
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  promptsContainer: {
    width: "100%",
    backgroundColor: "#2a2933",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  promptsTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 16,
  },
  promptItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#9C27B0",
    marginTop: 6,
    marginRight: 10,
  },
  promptText: {
    fontSize: 16,
    color: "#fff",
    flex: 1,
    lineHeight: 22,
  },
  journalButton: {
    flexDirection: "row",
    backgroundColor: "#9C27B0",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  journalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default ChallengeDetail;
