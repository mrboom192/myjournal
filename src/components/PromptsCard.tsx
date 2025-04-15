import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import i18n from "../locales";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PoppinsSemiBold } from "./StyledText";
import Colors from "../constants/Colors";

const journalPrompts = [
  i18n.t("prompts.grateful"),
  i18n.t("prompts.smile"),
  i18n.t("prompts.learned"),
  i18n.t("prompts.lookForward"),
  i18n.t("prompts.challenge"),
  i18n.t("prompts.inspires"),
  i18n.t("prompts.goal"),
  i18n.t("prompts.memory"),
  i18n.t("prompts.feeling"),
  i18n.t("prompts.proud"),
];

const PROMPT_DURATION_SECONDS = 60;

const PromptsCard = () => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [promptProgress, setPromptProgress] = useState(0);
  const promptIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Set up the interval for changing prompts
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (promptIntervalRef.current) clearInterval(promptIntervalRef.current);
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    promptIntervalRef.current = setInterval(() => {
      setCurrentPromptIndex(
        (prevIndex) => (prevIndex + 1) % journalPrompts.length
      );
    }, PROMPT_DURATION_SECONDS * 1000);

    return () => {
      if (promptIntervalRef.current) clearInterval(promptIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    setPromptProgress(0);

    const totalDuration = PROMPT_DURATION_SECONDS * 1000;
    const intervalDelay = 1000;

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    progressIntervalRef.current = setInterval(() => {
      setPromptProgress((prev) => {
        const next = prev + intervalDelay / totalDuration;
        return next >= 1 ? 1 : next;
      });
    }, intervalDelay);

    return () => {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    };
  }, [currentPromptIndex]);

  const handlePromptPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/(app)/(modals)/journal-entry",
      params: {
        mode: "edit",
        title: "Journal Entry",
        content: `${journalPrompts[currentPromptIndex]}\n\n`,
      },
    });
  };

  return (
    <TouchableOpacity
      style={styles.promptCard}
      onPress={handlePromptPress}
      activeOpacity={0.8}
    >
      <Text style={styles.promptLabel}>This months prompt(s)</Text>
      <PoppinsSemiBold style={styles.promptText}>
        {journalPrompts[currentPromptIndex]}
      </PoppinsSemiBold>
      <View style={styles.promptProgressContainer}>
        <View
          style={[
            styles.promptProgressBar,
            { width: `${promptProgress * 100}%` },
          ]}
        />
      </View>
      <View style={styles.promptActionHint}>
        <Ionicons
          name="create-outline"
          size={16}
          color="rgba(255,255,255,0.7)"
        />
        <Text style={styles.promptActionText}>Tap to write</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PromptsCard;

const styles = StyleSheet.create({
  promptCard: {
    backgroundColor: Colors.purple,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    padding: 20,
    position: "relative",
    overflow: "hidden",
    marginHorizontal: 16,
  },
  promptLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginBottom: 5,
  },
  promptText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  promptProgressContainer: {
    height: 4,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  promptProgressBar: {
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  promptActionHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  promptActionText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginLeft: 5,
  },
});
