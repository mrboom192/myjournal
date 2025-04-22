import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { PoppinsSemiBold } from "../StyledText";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useTranslation } from "@/src/hooks/useTranslation";

const ChallengesButton = () => {
  const t = useTranslation();

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
        {t("home.viewChallenges")}
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
