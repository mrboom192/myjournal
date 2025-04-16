import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { PoppinsSemiBold } from "../StyledText";
import i18n from "../../locales";
import Colors from "@/src/constants/Colors";

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
    borderRadius: 12,
    marginHorizontal: 16,
  },
  emptyStateText: {
    color: Colors.grey,
    fontSize: 16,
  },
});
