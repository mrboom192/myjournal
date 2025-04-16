import React, { useState } from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import { subMonths, addMonths, isSameMonth } from "date-fns";

import JournalCalendar from "@/src/components/JournalCalendar";
import { useUser } from "@/src/contexts/UserContext";
import PromptsCard from "@/src/components/PromptsCard";
import Collections from "@/src/components/Collections/Collections";
import ChallengesButton from "@/src/components/buttons/ChallengesButton";
import Colors from "@/src/constants/Colors";
import Entries from "@/src/components/Entries";
import MonthSelector from "@/src/components/MonthSelector";

const HomePage = () => {
  const { loading } = useUser();
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const isCurrentMonthYear = isSameMonth(new Date(), selectedDate);

  const handlePrevMonth = () => {
    setSelectedDate((prev) => subMonths(prev, 1));
  };

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
