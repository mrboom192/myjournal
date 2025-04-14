import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import NoCollections from "./NoCollections";
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
    <>
      {/* Collections */}
      <PoppinsSemiBold style={styles.sectionTitle}>
        {i18n.t("home.collections")}
      </PoppinsSemiBold>
      {collections.length === 0 ? (
        <NoCollections />
      ) : (
        collections.map((collection) => (
          <CollectionButton key={collection.id} data={collection} />
        ))
      )}
    </>
  );
};

export default Collections;

const styles = StyleSheet.create({
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
});
