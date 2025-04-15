import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import CollectionButton from "./CollectionButton";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useUser } from "@/src/contexts/UserContext";
import { PoppinsSemiBold } from "../StyledText";
import i18n from "@/src/locales";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

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
    <View>
      <View
        style={{
          marginBottom: 10,
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
          marginHorizontal: 16,
        }}
      >
        <PoppinsSemiBold style={styles.sectionTitle}>
          {i18n.t("home.collections")}
        </PoppinsSemiBold>
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            width: 24,
            height: 24,
            borderRadius: 9999,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => router.push("/(app)/(other)/collections")}
        >
          <Ionicons name="chevron-forward" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal contentContainerStyle={{ paddingLeft: 16 }}>
        {collections.map((collection) => (
          <CollectionButton key={collection.id} data={collection} />
        ))}
      </ScrollView>
      {/* <TouchableOpacity
        style={styles.addCollectionButton}
        onPress={() => router.push("/(app)/(modals)/add-collection")}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <PoppinsSemiBold style={styles.addCollectionButtonText}>
          {i18n.t("home.addCollection")}
        </PoppinsSemiBold>
      </TouchableOpacity> */}
    </View>
  );
};

export default Collections;

const styles = StyleSheet.create({
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
  },
});
