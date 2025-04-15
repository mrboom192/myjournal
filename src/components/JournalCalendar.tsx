import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useUser } from "../contexts/UserContext";
import NoEntries from "./NoEntries";
import JournalEntry from "./JournalEntry";

const JournalCalendar = () => {
  const { data, loading } = useUser();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [entries, setEntries] = useState<any[]>([]);
  const [allEntries, setAllEntries] = useState<any[]>([]);

  // Get entries
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

  const markedDates = Object.fromEntries(
    entries.map((entry) => {
      const dateStr = entry.createdAt?.toDate().toISOString().split("T")[0];
      return [
        dateStr,
        {
          marked: true,
          dotColor: "#fff",
        },
      ];
    })
  );

  return (
    <View>
      <Calendar
        markedDates={markedDates}
        current={new Date().toISOString()}
        theme={{
          calendarBackground: "transparent",
          textSectionTitleColor: "#9b9a9e",
          selectedDayBackgroundColor: "#fff",
          selectedDayTextColor: "#fff",
          todayTextColor: "#FFC107",
          dayTextColor: "#fff",
          textDisabledColor: "#444",
          monthTextColor: "#fff",
          arrowColor: "#fff",
          textDayFontFamily: "Poppins_600SemiBold",
          textDayHeaderFontFamily: "Poppins_400Regular",
          textMonthFontFamily: "Poppins_600SemiBold",
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        style={styles.calendar}
        onDayPress={(day: { dateString: string }) => {
          setSelectedDate(day.dateString); // e.g., "2024-04-17"
        }}
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
            // <NoEntries formattedMonthYear={formattedMonthYear} />
            <></>
          ) : (
            entries.map((entry) => <JournalEntry key={entry.id} data={entry} />)
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    marginBottom: 16,
  },
});

export default JournalCalendar;
