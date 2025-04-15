import { Text, StyleSheet, ScrollView } from "react-native";
import JournalCalendar from "@/src/components/JournalCalendar";
import { useUser } from "@/src/contexts/UserContext";
import PromptsCard from "@/src/components/PromptsCard";
import Collections from "@/src/components/Collections/Collections";
import ChallengesButton from "@/src/components/buttons/ChallengesButton";

const HomePage = () => {
  const { loading } = useUser();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
    >
      <PromptsCard />
      <Collections />
      <ChallengesButton />
      <JournalCalendar />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#1c1b22",
  },
  scrollContent: {
    flexDirection: "column",
    gap: 16,
    paddingTop: 0,
    paddingBottom: 100,
  },
});

export default HomePage;
