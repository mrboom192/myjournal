import React from "react";
import { View, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

const JournalCalendar = ({
  entries,
  currentMonth,
  currentYear,
  setSelectedDate,
}: {
  entries: any[];
  currentMonth: number;
  currentYear: number;
  setSelectedDate: (date: string) => void;
}) => {
  const markedDates = Object.fromEntries(
    entries.map((entry) => {
      const dateStr = entry.createdAt?.toDate().toISOString().split("T")[0];
      return [
        dateStr,
        {
          marked: true,
          dotColor: "#9C27B0",
        },
      ];
    })
  );

  return (
    <View style={styles.calendarWrapper}>
      <Calendar
        markedDates={markedDates}
        current={String(new Date(currentYear, currentMonth, 1))}
        disableMonthChange={true}
        hideArrows={true}
        renderHeader={() => <></>}
        theme={{
          backgroundColor: "#2a2933",
          calendarBackground: "#2a2933",
          textSectionTitleColor: "#9b9a9e",
          selectedDayBackgroundColor: "#9C27B0",
          selectedDayTextColor: "#fff",
          todayTextColor: "#FFC107",
          dayTextColor: "#fff",
          textDisabledColor: "#444",
          monthTextColor: "#fff",
          arrowColor: "#fff",
          dotColor: "#9C27B0",
          selectedDotColor: "#fff",
          textDayFontWeight: "500",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "600",
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        style={styles.calendar}
        onDayPress={(day: { dateString: string }) => {
          setSelectedDate(day.dateString); // e.g., "2024-04-17"
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarWrapper: {
    backgroundColor: "#2a2933", // same as monthNavigation bg
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  calendar: {
    borderRadius: 12,
    overflow: "hidden",
  },
});

export default JournalCalendar;
