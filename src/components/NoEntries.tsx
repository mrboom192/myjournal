import { View, Text } from "react-native";
import React from "react";
import { PoppinsSemiBold } from "./StyledText";
import i18n from "../locales";
import Colors from "../constants/Colors";

const NoEntries = ({ formattedMonthYear }: { formattedMonthYear: string }) => {
  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        marginTop: 48,
        marginBottom: 64,
      }}
    >
      <PoppinsSemiBold
        style={{
          fontSize: 24,
          fontWeight: 600,
          color: Colors.grey,
        }}
      >
        {i18n.t("home.noEntries", { monthYear: formattedMonthYear })}
      </PoppinsSemiBold>
    </View>
  );
};

export default NoEntries;
