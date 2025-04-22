import { View, Text } from "react-native";
import React from "react";
import { PoppinsSemiBold } from "./StyledText";
import Colors from "../constants/Colors";
import { useTranslation } from "../hooks/useTranslation";

const NoEntries = ({ formattedMonthYear }: { formattedMonthYear: string }) => {
  const t = useTranslation();

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
        {t("home.noEntries", { monthYear: formattedMonthYear })}
      </PoppinsSemiBold>
    </View>
  );
};

export default NoEntries;
