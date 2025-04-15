import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import JournalCalendar from "@/src/components/JournalCalendar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import UserAvatar from "@/src/components/UserAvatar";
import { useUser } from "@/src/contexts/UserContext";
import {
  collection,
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
import Collections from "@/src/components/Collections/Collections";
import HomeHeader from "@/src/components/HomeHeader";

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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [entries, setEntries] = useState<any[]>([]);
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

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
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
      <JournalCalendar
        entries={allEntries}
        setSelectedDate={setSelectedDate}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />

      {selectedDate ? (
        // Show entries only for selected date
        <>
          {entries.filter((entry) => {
            const dateStr = entry.createdAt
              ?.toDate()
              .toISOString()
              .split("T")[0];
            return dateStr === selectedDate;
          }).length === 0 ? (
            <NoEntries formattedMonthYear={selectedDate} />
          ) : (
            entries
              .filter((entry) => {
                const dateStr = entry.createdAt
                  ?.toDate()
                  .toISOString()
                  .split("T")[0];
                return dateStr === selectedDate;
              })
              .map((entry) => <JournalEntry key={entry.id} data={entry} />)
          )}
        </>
      ) : (
        // Show all entries for the current month
        <>
          {entries.length === 0 ? (
            <NoEntries formattedMonthYear={formattedMonthYear} />
          ) : (
            entries.map((entry) => <JournalEntry key={entry.id} data={entry} />)
          )}
        </>
      )}

      {/* Prompt Card */}
      <PromptsCard />

      {/* Challenges Button */}
      <TouchableOpacity
        style={styles.challengesButton}
        onPress={handleOpenChallenges}
      >
        <View style={styles.challengesIconContainer}>
          <Ionicons name="trophy-outline" size={20} color="#FFC107" />
        </View>
        <PoppinsSemiBold style={styles.challengesButtonText}>
          {i18n.t("home.viewChallenges")}
        </PoppinsSemiBold>
      </TouchableOpacity>

      <Collections />

      <TouchableOpacity
        style={styles.addCollectionButton}
        onPress={() => router.push("/(app)/(modals)/add-collection")}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <PoppinsSemiBold style={styles.addCollectionButtonText}>
          {i18n.t("home.addCollection")}
        </PoppinsSemiBold>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#1c1b22",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
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
