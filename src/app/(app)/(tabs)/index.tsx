import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import UserAvatar from "@/src/components/UserAvatar";
import { useUser } from "@/src/contexts/UserContext";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import Colors from "@/src/constants/Colors";

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

const HomePage = () => {
  const router = useRouter();
  const { data, loading } = useUser();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      if (loading || !data?.uid) return;

      try {
        const db = getFirestore();
        const entriesRef = collection(db, "entries");
        const q = query(entriesRef, where("userId", "==", data.uid));
        const querySnapshot = await getDocs(q);

        const entriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<any, "id">),
        }));

        setEntries(entriesData);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };

    fetchEntries();
  }, [loading, data?.uid]);

  const handlePrevMonth = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleOpenChallenges = () => {
    router.push("/challenges");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greetingRow}>
          <UserAvatar size={40} canUpload={false} />
          <Text style={styles.greeting}>Hi, {data.firstName || "Ghulam"}!</Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity onPress={handlePrevMonth}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {months[currentMonth]} {currentYear}
          </Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Prompt Card */}
        <View style={styles.promptCard}>
          <Text style={styles.promptLabel}>Prompt</Text>
          <Text style={styles.promptText}>
            What's one thing you're grateful for?
          </Text>
        </View>

        {!entries && (
          <View
            style={{
              width: "100%",
              alignItems: "center",
              marginTop: 48,
              marginBottom: 64,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: Colors.light.grey,
              }}
            >
              No entries
            </Text>
          </View>
        )}

        {/* Recent Journal Entry */}
        {entries.map((entry) => {
          return (
            <TouchableOpacity
              key={entry.id}
              style={styles.journalEntryCard}
              onPress={() => {
                router.push({
                  pathname: "/(app)/(modals)/journal-entry",
                  params: {
                    title: entry.title,
                    content: entry.content,
                    mode: "edit",
                    challengeId: entry.challengeId,
                  },
                });
              }}
            >
              <Text style={styles.entryTitle}>{entry.title}</Text>
              <Text style={styles.entryDate}>
                Created on {entry.createdAt?.toDate().toLocaleDateString()}
              </Text>
              <View style={styles.divider} />
              <Text style={styles.entryContent} numberOfLines={4}>
                {entry.content}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Challenges Button */}
        <TouchableOpacity
          style={styles.challengesButton}
          onPress={handleOpenChallenges}
        >
          <View style={styles.challengesIconContainer}>
            <Ionicons name="trophy-outline" size={20} color="#FFC107" />
          </View>
          <Text style={styles.challengesButtonText}>View Challenges</Text>
        </TouchableOpacity>

        {/* Collections */}
        <Text style={styles.sectionTitle}>Collections</Text>

        <TouchableOpacity style={styles.collectionItem}>
          <View style={styles.collectionIconContainer}>
            <Ionicons name="journal-outline" size={20} color="#9C27B0" />
          </View>
          <Text style={styles.collectionName}>Wisconsin Trip</Text>
          <Ionicons name="chevron-forward" size={20} color="#9b9a9e" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.collectionItem}>
          <View style={styles.collectionIconContainer}>
            <Ionicons name="leaf-outline" size={20} color="#4CAF50" />
          </View>
          <Text style={styles.collectionName}>Hiking in the Wichita...</Text>
          <Ionicons name="chevron-forward" size={20} color="#9b9a9e" />
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  greeting: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  searchButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#2a2933",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 5,
    paddingBottom: 100,
  },
  monthNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  promptCard: {
    backgroundColor: "#9C27B0",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    position: "relative",
    overflow: "hidden",
  },
  promptLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginBottom: 5,
  },
  promptText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  journalEntryCard: {
    backgroundColor: "#2a2933",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  entryTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  entryDate: {
    color: "#9b9a9e",
    fontSize: 14,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#3b3946",
    marginBottom: 10,
  },
  entryContent: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  collectionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2933",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  collectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(156, 39, 176, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  collectionName: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
  },
  challengesButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2933",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  challengesIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  challengesButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default HomePage;
