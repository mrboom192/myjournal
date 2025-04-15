import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import {
  query,
  collection,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { startOfMonth, endOfMonth } from "date-fns";
import { useUser } from "../contexts/UserContext";
import { db } from "@/firebaseConfig";
import { PoppinsSemiBold } from "./StyledText";
import Colors from "../constants/Colors";
import JournalEntry from "./JournalEntry";
import { ScrollView } from "react-native-gesture-handler";

type Props = {
  month: number;
  year: number;
};

const Entries = ({ month, year }: Props) => {
  const { data } = useUser();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!data) return;

    const start = Timestamp.fromDate(startOfMonth(new Date(year, month)));
    const end = Timestamp.fromDate(endOfMonth(new Date(year, month)));

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

  if (entries.length === 0) {
    return (
      <PoppinsSemiBold
        style={{
          width: "100%",
          textAlign: "center",
          color: Colors.grey,
          marginVertical: 24,
        }}
      >
        No entries for this month.
      </PoppinsSemiBold>
    );
  }

  return (
    <>
      {entries.map((entry) => (
        <JournalEntry key={entry.id} data={entry} />
      ))}
    </>
  );
};

export default Entries;
