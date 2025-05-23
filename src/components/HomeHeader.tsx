import { View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import UserAvatar from "./UserAvatar";
import { PoppinsSemiBold } from "./StyledText";
import { useUser } from "../contexts/UserContext";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/Colors";
import { useTranslation } from "../hooks/useTranslation";

const HomeHeader = () => {
  const { data, loading } = useUser();
  const t = useTranslation();

  const handleSearchPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(app)/(modals)/search");
  };

  if (loading) {
    return <></>;
  }

  return (
    <SafeAreaView style={{ backgroundColor: Colors.background }}>
      <View style={styles.header}>
        <View style={styles.greetingRow}>
          <UserAvatar size={40} canUpload={false} />
          <PoppinsSemiBold style={styles.greeting}>
            {t("home.greeting", { name: data.firstName })}
          </PoppinsSemiBold>
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchPress}
        >
          <Ionicons name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  greeting: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  searchButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#2a2933",
    justifyContent: "center",
    alignItems: "center",
  },
});
