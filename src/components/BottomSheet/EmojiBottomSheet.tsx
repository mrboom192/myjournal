import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import BottomSheetModalComponent from "./BottomSheet";
import { doc, updateDoc } from "firebase/firestore";
import { PoppinsSemiBold } from "../StyledText";
import { auth, db } from "@/firebaseConfig";
import React, { forwardRef } from "react";

const emojis = [
  "😊",
  "😃",
  "🤣",
  "😔",
  "😢",
  "😫",
  "😤",
  "😡",
  "😴",
  "😎",
  "😭",
  "🤫",
  "🥶",
  "😑",
  "🤔",
  "😍",
  "😇",
  "😳",
  "😈",
  "🤪",
  "🤓",
  "🤩",
  "🤯",
  "🥳",
];

interface EmojiBottomSheetProps {}

const EmojiBottomSheet = forwardRef<
  BottomSheetModalMethods,
  EmojiBottomSheetProps
>((_props, ref) => {
  // Update the mood and store it in firebase
  async function handleChooseMood(emoji: string) {
    // If there is no authenticated user, return
    if (!auth.currentUser?.uid) {
      return;
    }

    // Reference to the user's document on firestore
    const userRef = doc(db, "users", auth.currentUser?.uid);

    // Update that doc
    await updateDoc(userRef, {
      mood: emoji,
    });
  }

  return (
    <BottomSheetModalComponent ref={ref}>
      <PoppinsSemiBold style={styles.emojiPickerTitle}>
        Pick your mood
      </PoppinsSemiBold>
      <View style={styles.emojiGrid}>
        {emojis.map((emoji) => (
          <TouchableOpacity
            key={emoji}
            onPress={() => handleChooseMood(emoji)}
            style={styles.emojiButton}
          >
            <Text style={{ fontSize: 28 }}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </BottomSheetModalComponent>
  );
});

export default EmojiBottomSheet;

const styles = StyleSheet.create({
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginHorizontal: 16,
    gap: 8,
  },
  emojiButton: {
    backgroundColor: "#444",
    padding: 6,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiPickerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 12,
  },
});
