import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { subMonths, addMonths, isSameMonth } from "date-fns";

import PromptsCard from "@/src/components/PromptsCard";
import Collections from "@/src/components/Collections/Collections";
import ChallengesButton from "@/src/components/buttons/ChallengesButton";
import Colors from "@/src/constants/Colors";
import Entries from "@/src/components/Entries";
import MonthSelector from "@/src/components/MonthSelector";

const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Derived state that just checks whether or not the date is the current month and year
  const isCurrentMonthYear = isSameMonth(new Date(), selectedDate);

  // Sets month to the previous month
  const handlePrevMonth = () => {
    setSelectedDate((prev) => subMonths(prev, 1));
  };

  // Sets month to the next month
  const handleNextMonth = () => {
    setSelectedDate((prev) => addMonths(prev, 1));
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
    >
      <MonthSelector
        date={selectedDate}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
      />
      {isCurrentMonthYear && (
        <>
          <PromptsCard />
          <Collections />
          <ChallengesButton />
        </>
      )}

      <Entries
        month={selectedDate.getMonth()}
        year={selectedDate.getFullYear()}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexDirection: "column",
    gap: 16,
    paddingTop: 0,
    paddingBottom: 128,
  },
});

export default HomePage;
