import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { router } from "expo-router";
import i18n from "../locales";
import { Entry } from "../types/Entry";
import { PoppinsRegular, PoppinsSemiBold } from "./StyledText";
import Colors from "../constants/Colors";
import { useTranslation } from "../hooks/useTranslation";

const JournalEntry = ({ data }: { data: Entry }) => {
  const t = useTranslation();

  return (
    <TouchableOpacity
      style={styles.journalEntryCard}
      onPress={() => {
        router.push({
          pathname: "/(app)/(modals)/journal-entry",
          params: {
            id: data.id,
            title: data.title,
            content: data.content,
            mode: "read",
            challengeId: data.challengeId,
          },
        });
      }}
    >
      <PoppinsSemiBold style={styles.entryTitle}>{data.title}</PoppinsSemiBold>
      <PoppinsRegular style={styles.entryDate}>
        {t("home.createdOn")}{" "}
        {data.createdAt?.toDate().toLocaleDateString(i18n.locale)}
      </PoppinsRegular>

      <View style={styles.divider} />
      <PoppinsRegular style={styles.entryContent} numberOfLines={4}>
        {data.content}
      </PoppinsRegular>
    </TouchableOpacity>
  );
};

export default JournalEntry;

const styles = StyleSheet.create({
  journalEntryCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
  },
  entryTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  entryDate: {
    color: "#9b9a9e",
    fontSize: 14,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#3b3946",
    marginBottom: 10,
  },
  entryContent: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
});
