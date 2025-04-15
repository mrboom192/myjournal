import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { PoppinsSemiBold } from "../StyledText";
import i18n from "@/src/locales";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

const ChallengesButton = () => {
  const handleOpenChallenges = () => {
    router.push("/challenges");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <TouchableOpacity
      style={styles.challengesButton}
      onPress={handleOpenChallenges}
    >
      <View style={styles.challengesIconContainer}>
        <Ionicons name="trophy-outline" size={20} color="#FFC107" />
      </View>
      <PoppinsSemiBold style={styles.challengesButtonText}>
        {i18n.t("home.viewChallenges")}
      </PoppinsSemiBold>
    </TouchableOpacity>
  );
};

export default ChallengesButton;

const styles = StyleSheet.create({
  challengesButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2933",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
  },
  challengesIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  challengesButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
