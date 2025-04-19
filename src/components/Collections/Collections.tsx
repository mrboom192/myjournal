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
import { Link, router } from "expo-router";
import Colors from "@/src/constants/Colors";
import NoCollections from "./NoCollections";

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
        marginHorizontal: 16,
        backgroundColor: "#2a2933",
        borderRadius: 16,
        paddingVertical: 16,
      }}
    >
      <View
        style={{
          marginBottom: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 8,
          alignItems: "center",
          marginHorizontal: 16,
        }}
      >
        <PoppinsSemiBold style={styles.sectionTitle}>
          {i18n.t("home.collections")}
        </PoppinsSemiBold>
        <Link href={"/(app)/(modals)/add-collection"} asChild>
          <TouchableOpacity
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              backgroundColor: "#FFF",
              borderRadius: 9999,
            }}
          >
            <PoppinsSemiBold style={{ fontSize: 12, color: Colors.background }}>
              New
            </PoppinsSemiBold>
          </TouchableOpacity>
        </Link>
      </View>

      {collections.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: 16,
            flexDirection: "row",
            gap: 8,
          }}
        >
          {collections.map((collection) => (
            <CollectionButton key={collection.id} data={collection} />
          ))}
        </ScrollView>
      ) : (
        <NoCollections />
      )}
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
