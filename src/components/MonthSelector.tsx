import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
};

const MonthSelector = ({ date, onPrev, onNext }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrev}>
        <Ionicons name="chevron-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.label}>{format(date, "MMMM yyyy")}</Text>
      <TouchableOpacity onPress={onNext}>
        <Ionicons name="chevron-forward" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});

export default MonthSelector;
