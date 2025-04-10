import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const Friends = () => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        gap: 16,
        padding: 26,
        backgroundColor: "#2a2933",
      }}
    >
      <Text>Friends</Text>
    </View>
  );
};

export default Friends;
