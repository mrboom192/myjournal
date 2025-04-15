import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@/src/contexts/UserContext";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import CollectionButton from "@/src/components/Collections/CollectionButton";
import { Ionicons } from "@expo/vector-icons";
import { PoppinsSemiBold } from "@/src/components/StyledText";
import { router, Stack } from "expo-router";
import i18n from "@/src/locales";

const Collections = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const { data, loading } = useUser();

  useEffect(() => {
    const db = getFirestore();
    const collectionsRef = collection(db, "collections");
    const q = query(collectionsRef, where("userId", "==", data.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const collectionsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<any, "id">),
      }));
      setCollections(collectionsData);
    });

    return () => unsubscribe();
  }, [loading, data?.uid]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#1c1b22",
      }}
    >
      <Stack.Screen
        options={{
          title: "My Collections",
          headerTitleStyle: { fontFamily: "dm-sb", color: "#fff" },
          headerStyle: { backgroundColor: "#1c1b22" },
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView contentContainerStyle={{ flexDirection: "column", gap: 8 }}>
        <TouchableOpacity
          style={styles.addCollectionButton}
          onPress={() => router.push("/(app)/(modals)/add-collection")}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <PoppinsSemiBold style={styles.addCollectionButtonText}>
            {i18n.t("home.addCollection")}
          </PoppinsSemiBold>
        </TouchableOpacity>
        {collections.map((collection) => (
          <TouchableOpacity
            style={[styles.collectionItem]}
            onPress={() => {
              router.push({
                pathname: "/(app)/(modals)/collection-view",
                params: {
                  id: collection.id,
                  name: collection.name,
                  color: collection.color,
                  icon: collection.icon,
                },
              });
            }}
          >
            <View
              style={[
                styles.collectionIconContainer,
                {
                  backgroundColor:
                    `${collection.color}20` || "rgba(156, 39, 176, 0.2)",
                },
              ]}
            >
              <Ionicons
                name={
                  (collection.icon as keyof typeof Ionicons.glyphMap) ||
                  "journal-outline"
                }
                size={20}
                color={collection.color || "#9C27B0"}
              />
            </View>
            <PoppinsSemiBold style={[styles.collectionName]}>
              {collection.name}
            </PoppinsSemiBold>
            <Ionicons name="chevron-forward" size={20} color="#9b9a9e" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Collections;

const styles = StyleSheet.create({
  collectionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2933",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  collectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(156, 39, 176, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  collectionName: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
  },
  addCollectionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a2933",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 5,
  },
  addCollectionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
});
