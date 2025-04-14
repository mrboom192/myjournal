import React from "react";
import {
  GestureResponderEvent,
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import { icon } from "../../constants/TabBarIcons";
import { PoppinsRegular } from "../StyledText";

const TabBarButton = ({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  color,
  label,
}: {
  onPress: (event: GestureResponderEvent) => void;
  onLongPress: (event: GestureResponderEvent) => void;
  isFocused: boolean;
  routeName: string;
  color: string;
  label: any;
}) => {
  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={[styles.pressable, isFocused && styles.activeBackground]}
      >
        {icon[routeName]({ color })}
      </Pressable>
    </View>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    overflow: "hidden",
  },
  pressable: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 9999,
  },
  activeBackground: {
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});
