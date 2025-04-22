import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import {
  query,
  collection,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import {
  startOfMonth,
  endOfMonth,
  format,
  isFuture,
  differenceInDays,
} from "date-fns";
import { useUser } from "../contexts/UserContext";
import { db } from "@/firebaseConfig";
import { PoppinsSemiBold } from "./StyledText";
import Colors from "../constants/Colors";
import JournalEntry from "./JournalEntry";

type Props = {
  month: number;
  year: number;
};

const Entries = ({ month, year }: Props) => {
  const { data } = useUser();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedDate = new Date(year, month); // centralize this
  const isFutureDate = isFuture(startOfMonth(selectedDate));
  const daysAway = differenceInDays(startOfMonth(selectedDate), new Date());
  const formattedMonth = format(selectedDate, "MMMM yyyy");

  useEffect(() => {
    if (!data) return;

    const start = Timestamp.fromDate(startOfMonth(selectedDate));
    const end = Timestamp.fromDate(endOfMonth(selectedDate));

    const entriesRef = collection(db, "entries");
    const q = query(
      entriesRef,
      where("userId", "==", data.uid),
      where("createdAt", ">=", start),
      where("createdAt", "<=", end),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedEntries = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEntries(fetchedEntries);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching entries:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [data, month, year]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  if (isFutureDate) {
    return (
      <View style={styles.entriesContainer}>
        <Divider />
        <PoppinsSemiBold
          style={{
            width: "100%",
            textAlign: "center",
            color: Colors.grey,
            marginBottom: 24,
          }}
        >
          {`${formattedMonth} is ${daysAway} day${
            daysAway !== 1 ? "s" : ""
          } away!`}
        </PoppinsSemiBold>
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View style={styles.entriesContainer}>
        <Divider />
        <PoppinsSemiBold
          style={{
            width: "100%",
            textAlign: "center",
            color: Colors.grey,
          }}
        >
          No entries for this month.
        </PoppinsSemiBold>
      </View>
    );
  }

  return (
    <View style={styles.entriesContainer}>
      <Divider />
      {entries.map((entry) => (
        <JournalEntry key={entry.id} data={entry} />
      ))}
    </View>
  );
};

const Divider = () => {
  return (
    <View style={styles.dividerContainer}>
      <View style={styles.line} />
      <PoppinsSemiBold style={styles.dividerText}>
        Journal Entries
      </PoppinsSemiBold>
      <View style={styles.line} />
    </View>
  );
};

export default Entries;

const styles = StyleSheet.create({
  entriesContainer: {
    flexDirection: "column",
    marginHorizontal: 16,
    gap: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  line: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.card,
    flex: 1,
    borderRadius: 9999,
  },
  dividerText: { color: Colors.card },
});
