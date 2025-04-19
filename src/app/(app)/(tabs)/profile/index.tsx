import React, { useRef, useState } from "react";
import { db } from "@/firebaseConfig";
import i18n from "@/src/locales";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  arrayUnion,
} from "firebase/firestore";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for icons
import { Stack, useRouter } from "expo-router";
import { useUser } from "@/src/contexts/UserContext";
import UserAvatar from "@/src/components/UserAvatar";
import { useSession } from "@/src/contexts/AuthContext";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import Avatar from "@/src/components/Avatar";
import Colors from "@/src/constants/Colors";
import { PoppinsRegular, PoppinsSemiBold } from "@/src/components/StyledText";
import LanguageBottomSheet from "@/src/components/BottomSheet/LanguageBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import EmojiBottomSheet from "@/src/components/BottomSheet/EmojiBottomSheet";
import UserStats from "@/src/components/UserStats";

const ProfileScreen = () => {
  const router = useRouter();
  const { data } = useUser();
  const { signOut, session } = useSession();
  const [friendCodeInput, setFriendCodeInput] = useState("");

  // Refs for each bottom sheet which are used below
  const LanguageBottomSheetRef = useRef<BottomSheetModal | null>(null);
  const EmojiBottomSheetRef = useRef<BottomSheetModal | null>(null);

  // Imperative function to show the language bottom sheet
  function handleShowLanguageBottomSheet() {
    LanguageBottomSheetRef.current?.present();
  }

  // Imperative function to show the emoji bottom sheet
  function handleShowEmojiBottomSheet() {
    EmojiBottomSheetRef.current?.present();
  }

  // Logs you out of your account
  function handleLogout() {
    signOut();
  }

  // Copies the friend code to your device clipboard, and vibrates the phone too
  async function handleCopy() {
    await Clipboard.setStringAsync(data.friendCode);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  // Adds a friend to your user document on firestore
  const handleAddFriend = async () => {
    const code = friendCodeInput.trim().toUpperCase();
    const q = query(collection(db, "users"), where("friendCode", "==", code));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const friendDoc = snapshot.docs[0];
      const friendId = friendDoc.id;

      if (friendId === session) {
        alert("You can't add yourself as a friend!");
        return;
      }

      if (!session) {
        console.warn("Cannot add friend — friend code is undefined.");
        return;
      }

      const userRef = doc(db, "users", session); //these adds the user as a friend for each person
      const friendRef = doc(db, "users", friendId);

      await updateDoc(userRef, {
        friends: arrayUnion({
          id: friendId,
          firstName: friendDoc.data().firstName,
          lastName: friendDoc.data().lastName,
          image: friendDoc.data().image || null,
        }),
      });

      await updateDoc(friendRef, {
        friends: arrayUnion({
          id: session,
          firstName: data.firstName,
          lastName: data.lastName,
          image: data.image || null,
        }),
      });

      alert("Your friend has been added!");
      setFriendCodeInput("");
    } else {
      alert("Friend code was not found.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with profile and menu */}
        <View style={styles.profileHeader}>
          <View style={styles.profileRow}>
            <UserAvatar size={48} canUpload={true} />
            <PoppinsRegular style={styles.userName}>
              {data.firstName} {data.lastName}
            </PoppinsRegular>
          </View>
          <Pressable>
            <Ionicons name="ellipsis-horizontal" size={24} color="#9b9a9e" />
          </Pressable>
        </View>

        <View style={{ marginBottom: 20 }}>
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
          >
            <PoppinsRegular style={styles.sectionTitle}>
              {i18n.t("profile.friendCode")}:{" "}
            </PoppinsRegular>
            <PoppinsRegular
              style={{ color: "#fff", fontWeight: "500", fontSize: 16 }}
            >
              {data.friendCode.toUpperCase()}
            </PoppinsRegular>
            <Pressable onPress={handleCopy}>
              <Ionicons
                name="copy"
                size={20}
                color="#fff"
                style={{ marginLeft: 10 }}
              />
            </Pressable>
          </View>

          {/* Add Friend */}
          <View style={{ marginTop: 20 }}>
            <PoppinsRegular style={styles.sectionTitle}>
              {i18n.t("profile.addFriend")}
            </PoppinsRegular>

            <View style={{ flexDirection: "row", marginTop: 8 }}>
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: "#2a2933",
                  padding: 10,
                  color: "#fff",
                  borderRadius: 8,
                }}
                placeholder={i18n.t("profile.enterCode")}
                placeholderTextColor="#888"
                value={friendCodeInput}
                onChangeText={setFriendCodeInput}
              />
              <TouchableOpacity
                onPress={handleAddFriend}
                style={{
                  backgroundColor: "#660066",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 8,
                  marginLeft: 10,
                }}
              >
                <PoppinsRegular style={{ color: "#fff", fontWeight: "600" }}>
                  {i18n.t("profile.add")}
                </PoppinsRegular>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Friends- checks if the length is 0, 1, or more for plural form of friends*/}
        <View style={styles.friendsSection}>
          <View style={styles.friendsTitleRow}>
            <PoppinsRegular style={styles.sectionTitle}>
              {!data.friends || data.friends.length === 0
                ? i18n.t("profile.noFriends")
                : `${data.friends.length} ${
                    data.friends.length === 1
                      ? i18n.t("profile.friend")
                      : i18n.t("profile.friends")
                  }`}
            </PoppinsRegular>

            <TouchableOpacity
              onPress={() => router.push("/(app)/(modals)/friends")}
            >
              <PoppinsRegular style={styles.seeAllText}>
                {i18n.t("profile.seeAll")}{" "}
                <Ionicons name="chevron-forward" size={16} color="#9b9a9e" />
              </PoppinsRegular>
            </TouchableOpacity>
          </View>
          <View style={styles.friendsAvatars}>
            {!data.friends || data.friends.length === 0 ? (
              <Text style={{ fontWeight: "500", color: "#9b9a9e" }}>
                No friends
              </Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {data.friends.map((friend: any, index: number) => (
                  <View
                    key={friend.id || index}
                    style={styles.friendAvatarContainer}
                  >
                    <Avatar
                      size={40}
                      initials={
                        friend?.firstName
                          ? friend.firstName[0] + friend.lastName[0]
                          : ""
                      }
                      uri={friend?.image || undefined}
                      mood={friend.mood}
                    />
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>

        {/* Mood*/}
        <TouchableOpacity
          style={styles.moodButton}
          onPress={handleShowEmojiBottomSheet}
        >
          <PoppinsRegular style={styles.moodButtonText}>
            {i18n.t("profile.mood")}
          </PoppinsRegular>
          <PoppinsRegular style={styles.moodEmoji}>
            {data.mood ? data.mood : ""}
          </PoppinsRegular>
        </TouchableOpacity>

        <UserStats />

        {/* Settings */}
        <PoppinsSemiBold style={styles.settingsHeader}>
          {i18n.t("profile.settings")}
        </PoppinsSemiBold>
        <View style={styles.settingsContainer}>
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => router.push("/(app)/(other)/account-info")}
          >
            <PoppinsRegular style={styles.settingsItemText}>
              {i18n.t("Account info")}
            </PoppinsRegular>
            <Ionicons name="chevron-forward" size={22} color="#9b9a9e" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.settingsItem, { borderBottomWidth: 0 }]}
            onPress={handleShowLanguageBottomSheet}
          >
            <PoppinsRegular style={styles.settingsItemText}>
              {i18n.t("Language")}
            </PoppinsRegular>
            <Ionicons name="chevron-forward" size={22} color="#9b9a9e" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <PoppinsRegular style={styles.logoutButtonText}>
            Log out
          </PoppinsRegular>
        </TouchableOpacity>
      </ScrollView>

      <LanguageBottomSheet ref={LanguageBottomSheetRef} />
      <EmojiBottomSheet ref={EmojiBottomSheetRef} />
    </SafeAreaView>
  );
};

export default ProfileScreen;

// STYLES

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 128,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  userName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  moodButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2933",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 20,
  },
  moodButtonText: {
    color: "#fff",
    fontWeight: "500",
    marginRight: 8,
  },
  moodEmoji: {
    fontSize: 18,
  },
  friendsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  friendsTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAllText: {
    color: "#9b9a9e",
    fontSize: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  friendsAvatars: {
    flexDirection: "row",
  },
  friendAvatarContainer: {
    marginRight: 10,
  },
  settingsHeader: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  settingsContainer: {
    backgroundColor: "#2a2933",
    borderRadius: 12,
    marginBottom: 20,
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3b3946",
  },
  settingsItemText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  logoutButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#2a2933",
  },
  logoutButtonText: {
    color: "#ff6b6b",
    fontWeight: "600",
    fontSize: 16,
  },
  languageContainer: {
    backgroundColor: "#2a2933",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
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
  emojiPickerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
});
