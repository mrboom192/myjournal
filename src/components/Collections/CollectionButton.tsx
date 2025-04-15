import { View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PoppinsSemiBold } from "../StyledText";
import { Collection } from "../../types/Collection";

const CollectionButton = ({ data }: { data: Collection }) => {
  return (
    <TouchableOpacity
      style={[styles.collectionItem, { backgroundColor: `${data.color}20` }]}
      onPress={() => {
        router.push({
          pathname: "/(app)/(modals)/collection-view",
          params: {
            id: data.id,
            name: data.name,
            color: data.color,
            icon: data.icon,
          },
        });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
    >
      <Ionicons
        name={
          (data.icon as keyof typeof Ionicons.glyphMap) || "journal-outline"
        }
        size={20}
        color={data.color || "#9C27B0"}
      />
      <PoppinsSemiBold style={[styles.collectionName, { color: data.color }]}>
        {data.name}
      </PoppinsSemiBold>
    </TouchableOpacity>
  );
};

export default CollectionButton;

const styles = StyleSheet.create({
  collectionItem: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: 100,
    height: 100,
    gap: 8,
    alignItems: "flex-start",
    borderRadius: 8,
    padding: 16,
  },
  collectionName: {
    fontSize: 10,
  },
});
