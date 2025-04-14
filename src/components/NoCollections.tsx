import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { PoppinsSemiBold } from "./StyledText";
import i18n from "../locales";

const NoCollections = () => {
  return (
    <View style={styles.emptyState}>
      <PoppinsSemiBold style={styles.emptyStateText}>
        {i18n.t("home.noCollections")}
      </PoppinsSemiBold>
    </View>
  );
};

export default NoCollections;

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#2a2933",
    borderRadius: 12,
    marginBottom: 10,
  },
  emptyStateText: {
    color: "#9b9a9e",
    fontSize: 16,
  },
});
