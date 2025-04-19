import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import BottomSheetModalComponent from "./BottomSheet";
import { doc, updateDoc } from "firebase/firestore";
import { PoppinsRegular } from "../StyledText";
import { auth, db } from "@/firebaseConfig";
import React, { forwardRef } from "react";
import i18n from "@/src/locales";

interface LanguageBottomSheetProps {}

const LanguageBottomSheet = forwardRef<
  BottomSheetModalMethods,
  LanguageBottomSheetProps
>((_props, ref) => {
  // Update the mood and store it in firebase
  async function handleChooseLocale(locale: string) {
    if (!auth.currentUser?.uid) {
      return;
    }

    const userRef = doc(db, "users", auth.currentUser?.uid);

    await updateDoc(userRef, {
      locale: locale,
    });

    i18n.locale = locale;
  }

  return (
    <BottomSheetModalComponent ref={ref}>
      <View style={styles.languageContainer}>
        <TouchableOpacity
          onPress={() => {
            handleChooseLocale("en");
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
            handleChooseLocale("es");
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
});

export default LanguageBottomSheet;

const styles = StyleSheet.create({
  languageContainer: {
    backgroundColor: "#2a2933",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
});
