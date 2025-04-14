import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
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
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Colors from "@/src/constants/Colors";

// Journal prompts that will rotate
const journalPrompts = [
  "What's one thing you're grateful for?",
  "What made you smile today?",
  "What's something new you learned recently?",
  "What are you looking forward to this week?",
  "What's a challenge you're facing right now?",
  "Write about someone who inspires you.",
  "What's a goal you're working towards?",
  "What's your favorite memory from last month?",
  "How are you feeling right now?",
  "What's something that made you proud recently?",
];

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
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const promptIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [promptProgress, setPromptProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [entries, setEntries] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [allEntries, setAllEntries] = useState<any[]>([]);

  // Set up the interval for changing prompts
  useEffect(() => {
    // Reset progress
    setPromptProgress(0);
    
    // Start the interval for changing prompts
    promptIntervalRef.current = setInterval(() => {
      setCurrentPromptIndex((prevIndex) => 
        (prevIndex + 1) % journalPrompts.length
      );
      setPromptProgress(0); // Reset progress when prompt changes
    }, 300000); // 5 minutes instead of 5 seconds
    
    // Clean up the interval on component unmount
    return () => {
      if (promptIntervalRef.current) {
        clearInterval(promptIntervalRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Set up interval for progress bar
  useEffect(() => {
    // Start the interval for updating progress
    progressIntervalRef.current = setInterval(() => {
      setPromptProgress((prev) => Math.min(prev + 0.00033, 1)); // Adjusted for 5 minutes (0.00033 ≈ 1/3000)
    }, 100);
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentPromptIndex]);

  useEffect(() => {
    if (loading || !data?.uid) return;

    const db = getFirestore();
    const entriesRef = collection(db, "entries");
    const q = query(entriesRef, where("userId", "==", data.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const entriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<any, "id">),
      }));
      setAllEntries(entriesData);
    });

    return () => unsubscribe();
  }, [loading, data?.uid]);

  // Filter entries whenever month/year changes
  useEffect(() => {
    if (allEntries.length > 0) {
      const filteredEntries = allEntries
        .filter(entry => {
          if (!entry.createdAt) return false;
          // Only show entries that aren't in collections
          if (entry.collectionId) return false;
          const entryDate = entry.createdAt.toDate();
          return entryDate.getMonth() === currentMonth && 
                 entryDate.getFullYear() === currentYear;
        })
        .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate()); // Sort by newest first
      setEntries(filteredEntries);
    } else {
      setEntries([]);
    }
  }, [allEntries, currentMonth, currentYear]);

  useEffect(() => {
    if (loading || !data?.uid) return;

    const db = getFirestore();
    const collectionsRef = collection(db, "collections");
    const q = query(collectionsRef, where("userId", "==", data.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const collectionsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<any, "id">),
      }));
      setCollections(collectionsData);
    });

    return () => unsubscribe();
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

  // Helper function to format month year for display
  const formattedMonthYear = `${months[currentMonth]} ${currentYear}`;

  const handleOpenChallenges = () => {
    router.push("/challenges");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleAddCollection = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/(app)/(modals)/add-collection"
    });
  };

  const handlePromptPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/(app)/(modals)/journal-entry",
      params: {
        mode: "edit",
        title: "Journal Entry",
        content: `${journalPrompts[currentPromptIndex]}\n\n`,
      },
    });
  };

  const handleSearchPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(app)/(modals)/search");
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
        <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
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
            {formattedMonthYear}
          </Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        
        {/* Prompt Card */}
        <TouchableOpacity 
          style={styles.promptCard}
          onPress={handlePromptPress}
          activeOpacity={0.8}
        >
          <Text style={styles.promptLabel}>Prompt</Text>
          <Text style={styles.promptText}>
            {journalPrompts[currentPromptIndex]}
          </Text>
          <View style={styles.promptProgressContainer}>
            <View 
              style={[
                styles.promptProgressBar, 
                { width: `${promptProgress * 100}%` }
              ]} 
            />
          </View>
          <View style={styles.promptActionHint}>
            <Ionicons name="create-outline" size={16} color="rgba(255,255,255,0.7)" />
            <Text style={styles.promptActionText}>Tap to write</Text>
          </View>
        </TouchableOpacity>

        {entries.length === 0 && (
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
              No entries for {formattedMonthYear}
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
                    id: entry.id,
                    title: entry.title,
                    content: entry.content,
                    mode: "read",
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

        {collections.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No collections yet</Text>
          </View>
        ) : (
          collections.map((collection) => (
            <TouchableOpacity 
              key={collection.id} 
              style={styles.collectionItem}
              onPress={() => {
                router.push({
                  pathname: "/(app)/(modals)/collection-view",
                  params: {
                    id: collection.id,
                    name: collection.name,
                    color: collection.color,
                    icon: collection.icon
                  }
                });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <View 
                style={[
                  styles.collectionIconContainer,
                  { backgroundColor: `${collection.color}20` || "rgba(156, 39, 176, 0.2)" }
                ]}
              >
                <Ionicons 
                  name={collection.icon || "journal-outline"} 
                  size={20} 
                  color={collection.color || "#9C27B0"} 
                />
              </View>
              <Text style={styles.collectionName}>{collection.name}</Text>
              <Ionicons name="chevron-forward" size={20} color="#9b9a9e" />
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity 
          style={styles.addCollectionButton}
          onPress={handleAddCollection}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addCollectionButtonText}>Add Collection</Text>
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
    marginBottom: 15,
  },
  promptProgressContainer: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  promptProgressBar: {
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  promptActionHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  promptActionText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginLeft: 5,
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
  emptyState: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#2a2933",
    borderRadius: 12,
    marginBottom: 10,
  },
  emptyStateText: {
    color: "#9b9a9e",
    fontSize: 16,
  },
  addCollectionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a2933",
    borderRadius: 12,
    padding: 16,
    marginTop: 5,
    marginBottom: 20,
  },
  addCollectionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  monthSummary: {
    backgroundColor: "#2a2933",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  monthSummaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default HomePage;
