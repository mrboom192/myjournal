import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Stack, useRouter } from "expo-router";
import JournalCalendar from "@/src/components/JournalCalendar";
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
import { PoppinsRegular, PoppinsSemiBold } from "@/src/components/StyledText";
import i18n from "@/src/locales"; //for languages
import PromptsCard from "@/src/components/PromptsCard";
import NoEntries from "@/src/components/NoEntries";
import JournalEntry from "@/src/components/JournalEntry";

const months = Array.from({ length: 12 }, (_, i) => {
  const monthName = new Date(2000, i, 1).toLocaleString(i18n.locale, {
    month: "long",
  });
  return monthName.charAt(0).toUpperCase() + monthName.slice(1);
});

const HomePage = () => {
  const router = useRouter();
  const { data, loading } = useUser();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [entries, setEntries] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [allEntries, setAllEntries] = useState<any[]>([]);

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
        .filter((entry) => {
          if (!entry.createdAt) return false;
          // Only show entries that aren't in collections
          if (entry.collectionId) return false;
          const entryDate = entry.createdAt.toDate();
          return (
            entryDate.getMonth() === currentMonth &&
            entryDate.getFullYear() === currentYear
          );
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
      pathname: "/(app)/(modals)/add-collection",
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
          <PoppinsSemiBold style={styles.greeting}>
            {i18n.t("home.greeting", { name: data.firstName })}
          </PoppinsSemiBold>
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchPress}
        >
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
          <PoppinsSemiBold style={styles.monthText}>
            {formattedMonthYear}
          </PoppinsSemiBold>
          <TouchableOpacity onPress={handleNextMonth}>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Monthly Calendar */}
        <JournalCalendar entries={allEntries} />

        {/* Monthly Calendar */}
        <JournalCalendar entries={allEntries} />

        <PromptsCard />

        {entries.length === 0 && (
          <NoEntries formattedMonthYear={formattedMonthYear} />
        )}

        {/* Recent Journal Entry */}
        {entries.map((entry) => {
          return <JournalEntry data={entry} />;
        })}

        {/* Challenges Button */}
        <TouchableOpacity
          style={styles.challengesButton}
          onPress={handleOpenChallenges}
        >
          <View style={styles.challengesIconContainer}>
            <Ionicons name="trophy-outline" size={20} color="#FFC107" />
          </View>
          <Text style={styles.challengesButtonText}>
            {i18n.t("home.viewChallenges")}
          </Text>
        </TouchableOpacity>

        {/* Collections */}
        <Text style={styles.sectionTitle}>{i18n.t("home.collections")}</Text>

        {collections.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {i18n.t("home.noCollections")}
            </Text>
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
                    icon: collection.icon,
                  },
                });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <View
                style={[
                  styles.collectionIconContainer,
                  {
                    backgroundColor:
                      `${collection.color}20` || "rgba(156, 39, 176, 0.2)",
                  },
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
          <Text style={styles.addCollectionButtonText}>
            {i18n.t("home.addCollection")}
          </Text>
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
