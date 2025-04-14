import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  entries: any[]; // Array of journal entries
}

const JournalCalendar: React.FC<Props> = ({ entries }) => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const markedDates = useMemo(() => {
    const marks: any = {};
    entries.forEach((entry) => {
      const dateStr = entry.createdAt?.toDate().toISOString().split("T")[0];
      if (dateStr) {
        marks[dateStr] = {
          marked: true,
          dotColor: "#9C27B0",
          ...(dateStr === selectedDate ? { selected: true, selectedColor: "#9C27B0" } : {}),
        };
      }
    });
    return marks;
  }, [entries, selectedDate]);

  const filteredEntries = useMemo(() => {
    if (!selectedDate) return [];
    return entries.filter((entry) => {
      const dateStr = entry.createdAt?.toDate().toISOString().split("T")[0];
      return dateStr === selectedDate;
    });
  }, [entries, selectedDate]);

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.label}>Journal Calendar</Text> */}
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        style={styles.calendar}
        theme={{
          backgroundColor: "#2a2933",
          calendarBackground: "#2a2933",
          textSectionTitleColor: "#9b9a9e",
          selectedDayBackgroundColor: "#9C27B0",
          selectedDayTextColor: "#fff",
          todayTextColor: "#FFC107",
          dayTextColor: "#fff",
          textDisabledColor: "#444",
          arrowColor: "#fff",
          monthTextColor: "#fff",
          dotColor: "#9C27B0",
          selectedDotColor: "#fff",
          indicatorColor: "#9C27B0",
          textDayFontWeight: "500",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "600",
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
      />

      {selectedDate && filteredEntries.length > 0 && (
        <View style={styles.entryList}>
          <Text style={styles.entryListTitle}>
            Entries for {selectedDate}
          </Text>

          {filteredEntries.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              style={styles.entryCard}
              onPress={() =>
                router.push({
                  pathname: "/(app)/(modals)/journal-entry",
                  params: {
                    id: entry.id,
                    title: entry.title,
                    content: entry.content,
                    mode: "read",
                    challengeId: entry.challengeId,
                  },
                })
              }
            >
              <Text style={styles.entryTitle}>{entry.title}</Text>
              <Text style={styles.entryContent} numberOfLines={2}>
                {entry.content}
              </Text>
              <View style={styles.entryFooter}>
                <Ionicons name="eye-outline" size={16} color="#9b9a9e" />
                <Text style={styles.entryFooterText}>Tap to view</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedDate && filteredEntries.length === 0 && (
        <View style={styles.noEntries}>
          <Text style={styles.noEntriesText}>No entries for {selectedDate}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2a2933",
    borderRadius: 12,
    marginBottom: 20,
    padding: 16,
  },
  label: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  calendar: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },
  entryList: {
    marginTop: 10,
  },
  entryListTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  entryCard: {
    backgroundColor: "#1c1b22",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  entryTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  entryContent: {
    color: "#cfcfcf",
    fontSize: 14,
    marginTop: 4,
  },
  entryFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  entryFooterText: {
    color: "#9b9a9e",
    fontSize: 13,
    marginLeft: 5,
  },
  noEntries: {
    paddingVertical: 16,
    alignItems: "center",
  },
  noEntriesText: {
    color: "#9b9a9e",
    fontSize: 14,
  },
});

export default JournalCalendar;
