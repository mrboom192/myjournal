import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import TabBarButton from "./TabBarButton";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const handleNewJournal = () => {
    router.push({
      pathname: "/(app)/(modals)/journal-entry",
      params: { mode: "edit" },
    });
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          // We'll insert the Add button between index 0 and 1
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <React.Fragment key={route.key}>
              {index === 1 && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleNewJournal}
                >
                  <Ionicons name="add" size={28} color="#fff" />
                </TouchableOpacity>
              )}

              <TabBarButton
                onPress={onPress}
                onLongPress={onLongPress}
                isFocused={isFocused}
                routeName={route.name}
                color={isFocused ? "#1c1b22" : "#FFF"}
                label={label}
              />
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  tabBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1b22",
    padding: 8,
    borderRadius: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButton: {
    borderRadius: 9999,
    padding: 16,
    backgroundColor: "#9C27B0",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
  },
});
