import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";

const CollectionViewScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [entries, setEntries] = useState<any[]>([]);
  const [collectionData, setCollectionData] = useState<any>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!params.id) return;

      try {
        // Fetch collection data
        const collectionRef = collection(db, "collections");
        const collectionDoc = await getDocs(query(collectionRef, where("id", "==", params.id)));
        if (!collectionDoc.empty) {
          setCollectionData(collectionDoc.docs[0].data());
        }

        // Fetch entries in this collection
        const entriesRef = collection(db, "entries");
        const q = query(entriesRef, where("collectionId", "==", params.id));
        const querySnapshot = await getDocs(q);
        
        const entriesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).sort((a: any, b: any) => b.createdAt.toDate() - a.createdAt.toDate());

        setEntries(entriesData);
      } catch (error) {
        console.error("Error fetching collection entries:", error);
      }
    };

    fetchEntries();
  }, [params.id]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          {collectionData && (
            <>
              <View
                style={[
                  styles.collectionIcon,
                  { backgroundColor: `${collectionData.color}20` || "rgba(156, 39, 176, 0.2)" }
                ]}
              >
                <Ionicons
                  name={collectionData.icon || "journal-outline"}
                  size={20}
                  color={collectionData.color || "#9C27B0"}
                />
              </View>
              <Text style={styles.headerTitle}>{collectionData.name}</Text>
            </>
          )}
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No entries in this collection</Text>
          </View>
        ) : (
          entries.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              style={styles.entryCard}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push({
                  pathname: "/(app)/(modals)/journal-entry",
                  params: {
                    id: entry.id,
                    title: entry.title,
                    content: entry.content,
                    mode: "read",
                    challengeId: entry.challengeId,
                    collectionId: entry.collectionId,
                  },
                });
              }}
            >
              <Text style={styles.entryTitle}>{entry.title}</Text>
              <Text style={styles.entryDate}>
                Created on {entry.createdAt?.toDate().toLocaleDateString()}
              </Text>
              <View style={styles.divider} />
              <Text style={styles.entryContent} numberOfLines={4}>
                {entry.content}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1b22",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  collectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#2a2933",
    borderRadius: 12,
    marginTop: 20,
  },
  emptyStateText: {
    color: "#9b9a9e",
    fontSize: 16,
  },
  entryCard: {
    backgroundColor: "#2a2933",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  entryTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  entryDate: {
    color: "#9b9a9e",
    fontSize: 14,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#3b3946",
    marginBottom: 10,
  },
  entryContent: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
});

export default CollectionViewScreen; 