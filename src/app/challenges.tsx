import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const challenges = [
  {
    id: "1",
    title: "Write an entry for today",
    points: 5,
    description: "Write anything on your mind today!",
    icon: "create-outline" as const,
    color: "#9C27B0",
  },
  {
    id: "2",
    title: "Write down a new recipe",
    points: 10,
    description:
      "Learned a new recipe? Make sure to keep track of it! Write down the ingredients and instructions.",
    icon: "restaurant-outline" as const,
    color: "#4CAF50",
  },
  {
    id: "3",
    title: "Favorite memory",
    points: 10,
    description: "Want to remember a moment forever? Make sure to write it!",
    icon: "heart-outline" as const,
    color: "#F44336",
  },
  {
    id: "4",
    title: "Movies/Shows List",
    points: 10,
    description: "Create a list of your favorite shows/movies.",
    icon: "film-outline" as const,
    color: "#2196F3",
  },
  {
    id: "5",
    title: "Gym Plan",
    points: 10,
    description: "Make sure to stay on track by creating a gym plan.",
    icon: "fitness-outline" as const,
    color: "#FF9800",
  },
  {
    id: "6",
    title: "Goals",
    points: 10,
    description:
      "Write an entry reflecting on the goals you have set for this year!",
    icon: "trophy-outline" as const,
    color: "#FFC107",
  },
  {
    id: "7",
    title: "Travel Journal ",
    points: 10,
    description:
      "Write down places, hotels, locations visited, and important information here.",
    icon: "airplane-outline" as const,
    color: "#03A9F4",
  },
];

const Challenges = () => {
  const router = useRouter();
  const [streak, setStreak] = useState(0);

  const checkStreak = async () => {
    try {
      const lastOpened = await AsyncStorage.getItem("lastOpened");
      const storedStreak = await AsyncStorage.getItem("streak");

      const today = new Date().toDateString();
      if (lastOpened === today) {
        return; // Already opened today, do nothing
      }

      if (lastOpened) {
        const lastDate = new Date(lastOpened);
        const today = new Date(new Date().toDateString());
        const difference = Math.floor(
          (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        ); // Difference in days

        if (difference === 1) {
          // User came back the next day, increase streak
          const newStreak = parseInt(storedStreak || "0") + 1;
          setStreak(newStreak);
          await AsyncStorage.setItem("streak", newStreak.toString());
        } else {
          // User skipped a day, reset streak
          setStreak(1);
          await AsyncStorage.setItem("streak", "1");
        }
      } else {
        // First time opening the app
        setStreak(1);
        await AsyncStorage.setItem("streak", "1");
      }

      // Update last opened date
      await AsyncStorage.setItem("lastOpened", today);
    } catch (error) {
      console.error("Error checking streak:", error);
    }
  };

  useEffect(() => {
    checkStreak();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Challenges</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Streak Card */}
      <View style={styles.streakContainer}>
        <Ionicons name="flame" size={24} color="#FFC107" />
        <Text style={styles.streakText}>{streak} Days Streak</Text>
      </View>

      {/* Challenge List */}
      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.challengeItem}
            onPress={() => router.push(`/challenge/${item.title}`)}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
              <Ionicons name={item.icon} size={24} color={item.color} />
            </View>
            <View style={styles.challengeContent}>
              <Text style={styles.challengeText}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsText}>{item.points}p</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2933",
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
    color: "#FFC107",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  challengeItem: {
    flexDirection: "row",
    backgroundColor: "#2a2933",
    borderRadius: 12,
    marginBottom: 10,
    padding: 16,
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  challengeContent: {
    flex: 1,
  },
  challengeText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#9b9a9e",
    marginTop: 4,
  },
  pointsContainer: {
    backgroundColor: "#3b3946",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pointsText: {
    fontSize: 14,
    color: "#f0883e",
    fontWeight: "bold",
  },
});

export default Challenges;
