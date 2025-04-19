import React from "react";
import { View, StyleSheet } from "react-native";

import { PoppinsRegular } from "./StyledText";
import i18n from "../locales";

const UserStats = () => {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <PoppinsRegular style={styles.statValue}>12</PoppinsRegular>
        <PoppinsRegular style={styles.statLabel}>
          {i18n.t("profile.entriesThisYear")}
        </PoppinsRegular>
      </View>
      <View style={styles.statItem}>
        <PoppinsRegular style={styles.statValue}>2,153</PoppinsRegular>
        <PoppinsRegular style={styles.statLabel}>
          {i18n.t("profile.wordsWritten")}
        </PoppinsRegular>
      </View>
    </View>
  );
};

export default UserStats;

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#2a2933",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f0883e",
    marginBottom: 4, // add spacing between value and label
  },

  statLabel: {
    color: "#9b9a9e",
    fontSize: 14,
    textAlign: "center",
  },

  statSubLabel: {
    color: "#9b9a9e",
    fontSize: 12,
  },
});
