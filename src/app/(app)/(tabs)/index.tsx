import { View, Text, StyleSheet } from "react-native";
import React from "react";

const Page = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to MyJournal!!!!!!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
});

export default Page;
