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
      style={styles.collectionItem}
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
      <View
        style={[
          styles.collectionIconContainer,
          {
            backgroundColor: `${data.color}20` || "rgba(156, 39, 176, 0.2)",
          },
        ]}
      >
        <Ionicons
          name={
            (data.icon as keyof typeof Ionicons.glyphMap) || "journal-outline"
          }
          size={20}
          color={data.color || "#9C27B0"}
        />
      </View>
      <PoppinsSemiBold style={styles.collectionName}>
        {data.name}
      </PoppinsSemiBold>
      <Ionicons name="chevron-forward" size={20} color="#9b9a9e" />
    </TouchableOpacity>
  );
};

export default CollectionButton;

const styles = StyleSheet.create({
  collectionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2933",
    borderRadius: 12,
    padding: 16,
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
});
