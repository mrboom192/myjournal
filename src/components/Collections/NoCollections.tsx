import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { PoppinsSemiBold } from "../StyledText";
import Colors from "@/src/constants/Colors";
import { useTranslation } from "@/src/hooks/useTranslation";

const NoCollections = () => {
  const t = useTranslation();

  return (
    <View style={styles.emptyState}>
      <PoppinsSemiBold style={styles.emptyStateText}>
        {t("home.noCollections")}
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
