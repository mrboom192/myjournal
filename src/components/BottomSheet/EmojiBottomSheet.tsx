import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import BottomSheetModalComponent from "./BottomSheet";
import { PoppinsRegular } from "../StyledText";
import i18n from "@/src/locales";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

type Props = {
  setShowLanguageOptions: (value: boolean) => void;
  ref?: React.Ref<BottomSheetModal>;
};

const EmojiBottomSheet = ({ setShowLanguageOptions, ref }: Props) => {
  return (
    <BottomSheetModalComponent ref={ref}>
      <View style={styles.languageContainer}>
        <PoppinsRegular style={styles.emojiPickerTitle}>
          Select Language
        </PoppinsRegular>

        <TouchableOpacity
          onPress={() => {
            i18n.locale = "en";
            setShowLanguageOptions(false);
          }}
        >
          <PoppinsRegular
            style={{ color: "#fff", fontSize: 18, marginVertical: 8 }}
          >
            English
          </PoppinsRegular>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            i18n.locale = "es";
            setShowLanguageOptions(false);
          }}
        >
          <PoppinsRegular
            style={{ color: "#fff", fontSize: 18, marginVertical: 8 }}
          >
            Español
          </PoppinsRegular>
        </TouchableOpacity>
      </View>
    </BottomSheetModalComponent>
  );
};

export default EmojiBottomSheet;

const styles = StyleSheet.create({
  languageContainer: {
    backgroundColor: "#2a2933",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  emojiPickerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  emojiContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#2a2933",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 100,
  },
});
