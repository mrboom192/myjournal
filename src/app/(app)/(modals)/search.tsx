import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@/src/contexts/UserContext";
import {
  collection,
  getFirestore,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Colors from "@/src/constants/Colors";

export default function SearchModal() {
  const router = useRouter();
  const { data } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (!text.trim() || !data?.uid) {
      setSearchResults([]);
      return;
    }

    const db = getFirestore();
    const entriesRef = collection(db, "entries");
    const q = query(
      entriesRef,
      where("userId", "==", data.uid)
    );

    try {
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<any, "id">),
        }))
        .filter(entry => 
          entry.title.toLowerCase().includes(text.toLowerCase())
        );
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching entries:", error);
    }
  };

  const handleEntryPress = (entry: any) => {
    router.push({
      pathname: "/(app)/(modals)/journal-entry",
      params: {
        id: entry.id,
        title: entry.title,
        content: entry.content,
        mode: "read",
        challengeId: entry.challengeId,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Search Entries",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9b9a9e" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search journal entries..."
          placeholderTextColor="#9b9a9e"
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons name="close-circle" size={20} color="#9b9a9e" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handleEntryPress(item)}
          >
            <Text style={styles.resultTitle}>{item.title}</Text>
            <Text style={styles.resultDate}>
              {item.createdAt?.toDate().toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery.length > 0
                ? "No entries found"
                : "Start typing to search entries"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1b22",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2933",
    margin: 16,
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    padding: 0,
  },
  resultItem: {
    backgroundColor: "#2a2933",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
  },
  resultTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  resultDate: {
    color: "#9b9a9e",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 32,
  },
  emptyText: {
    color: "#9b9a9e",
    fontSize: 16,
  },
}); 