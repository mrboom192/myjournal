import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";

// Fetch challenge info based on title
const getChallengeInfo = (title: string) => {
  // This is a simplified version - in a real app this would fetch from a database
  const challenge = challenges.find(c => c.title === title);
  return challenge || challenges[0]; // Return first challenge as fallback
};

const challenges = [
  {
    id: "1",
    title: "Write an entry for today",
    points: 5,
    description: "Write anything on your mind today!",
    icon: "create-outline" as const,
    color: "#9C27B0",
    prompts: [
      "What made you smile today?",
      "What's one thing you learned today?",
      "How are you feeling right now?"
    ]
  },
  {
    id: "2",
    title: "Write down a new recipe",
    points: 10,
    description: "Learned a new recipe? Make sure to keep track of it! Write down the ingredients and instructions.",
    icon: "restaurant-outline" as const,
    color: "#4CAF50",
    prompts: [
      "What ingredients did you use?",
      "What's the cooking process?",
      "Where did you learn this recipe?"
    ]
  },
  {
    id: "3",
    title: "Favorite memory",
    points: 10,
    description: "Want to remember a moment forever? Make sure to write it!",
    icon: "heart-outline" as const,
    color: "#F44336",
    prompts: [
      "What made this memory special?",
      "Who was there with you?",
      "How did it make you feel?"
    ]
  },
  {
    id: "4",
    title: "Movies/Shows List",
    points: 10,
    description: "Create a list of your favorite shows/movies.",
    icon: "film-outline" as const,
    color: "#2196F3",
    prompts: [
      "What are your top 5 movies/shows?",
      "What genre do you enjoy most?",
      "Any recommendations you want to remember?"
    ]
  },
  {
    id: "5",
    title: "Gym Plan",
    points: 10,
    description: "Make sure to stay on track by creating a gym plan.",
    icon: "fitness-outline" as const,
    color: "#FF9800",
    prompts: [
      "What are your fitness goals?",
      "What's your weekly workout schedule?",
      "What exercises do you want to focus on?"
    ]
  },
  {
    id: "6",
    title: "Goals",
    points: 10,
    description: "Write an entry reflecting on the goals you have set for this year!",
    icon: "trophy-outline" as const,
    color: "#FFC107",
    prompts: [
      "What are your top 3 goals this year?",
      "What progress have you made so far?",
      "What's your plan to achieve them?"
    ]
  },
  {
    id: "7",
    title: "Travel Journal",
    points: 10,
    description: "Write down places, hotels, locations visited, and important information here.",
    icon: "airplane-outline" as const,
    color: "#03A9F4",
    prompts: [
      "Where did you go?",
      "What was your favorite part of the trip?",
      "Any must-visit places to remember?"
    ]
  },
];

const ChallengeDetail = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const title = params.title as string;
  const challengeInfo = getChallengeInfo(title);

  const handleCreateJournal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Create a starter content based on the challenge prompts
    const promptText = challengeInfo.prompts.map(p => `• ${p}\n`).join('\n');
    const starterContent = `${challengeInfo.description}\n\n${promptText}`;
    
    // Format a better title for the journal entry
    const journalTitle = `${challengeInfo.title} Challenge`;
    
    // Navigate to journal entry with pre-filled content
    router.push({
      pathname: "/(app)/(modals)/journal-entry",
      params: { 
        title: journalTitle,
        content: starterContent,
        editMode: true,
        isChallenge: true,
        challengeId: challengeInfo.id
      }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Challenge Icon */}
        <View style={[styles.iconContainer, { backgroundColor: `${challengeInfo.color}20` }]}>
          <Ionicons name={challengeInfo.icon} size={48} color={challengeInfo.color} />
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
    backgroundColor: "#1c1b22",
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

