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
import { Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useUser } from "@/src/contexts/UserContext";
import UserAvatar from "@/src/components/UserAvatar";
import { useSession } from "@/src/contexts/AuthContext";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import Avatar from "@/src/components/Avatar";
import Colors from "@/src/constants/Colors";
import { PoppinsRegular, PoppinsSemiBold } from "@/src/components/StyledText";
import EmojiBottomSheet from "@/src/components/BottomSheet/EmojiBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const ProfileScreen = () => {
  const router = useRouter();
  const { data, loading } = useUser();
  const { signOut, session } = useSession();
  const [friendCodeInput, setFriendCodeInput] = useState("");
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);

  function handleLogout() {
    signOut();
  }

  async function handleCopy() {
    await Clipboard.setStringAsync(data.friendCode);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  const [mood, setMood] = useState("😊");
  const [isMoodVisible, setMoodVisible] = useState(false);

  const EmojiBottomSheetRef = useRef<BottomSheetModal>(null);

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

  const switchToSpanish = () => {
    i18n.locale = "es";
  };
  const switchToEnglish = () => {
    i18n.locale = "en";
  };

  const handleShowLanguages = () => {
    console.log("RAN");
    EmojiBottomSheetRef.current?.expand();
  };

  if (loading) {
    return <PoppinsRegular>Loading...</PoppinsRegular>;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
          onPress={() => setMoodVisible(true)}
        >
          <PoppinsRegular style={styles.moodButtonText}>
            {i18n.t("profile.mood")}
          </PoppinsRegular>
          <PoppinsRegular style={styles.moodEmoji}>{mood}</PoppinsRegular>
        </TouchableOpacity>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          {/* <View style={styles.statItem}>
           <PoppinsRegular style={styles.statValue}>16</PoppinsRegular>
           <PoppinsRegular style={styles.statLabel}>{i18n.t("profile.days")}</PoppinsRegular>
           <PoppinsRegular style={styles.statLabel}>{i18n.t("profile.currentStreak")}</PoppinsRegular>
         </View> */}
          <View style={styles.statItem}>
            <PoppinsRegular style={styles.statValue}>12</PoppinsRegular>
            <PoppinsRegular style={styles.statLabel}>
              {i18n.t("profile.entriesThisYear")}
            </PoppinsRegular>
          </View>
          <View style={styles.statItem}>
            <PoppinsRegular style={styles.statValue}>2,153</PoppinsRegular>
            <PoppinsRegular style={styles.statLabel}>
              {i18n.t("profile.wordsWritten")}
            </PoppinsRegular>
          </View>
        </View>

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

          <TouchableOpacity style={styles.settingsItem}>
            <PoppinsRegular style={styles.settingsItemText}>
              {i18n.t("Notifications")}
            </PoppinsRegular>
            <Ionicons name="chevron-forward" size={22} color="#9b9a9e" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={handleShowLanguages}
          >
            <PoppinsRegular style={styles.settingsItemText}>
              {i18n.t("Language")}
            </PoppinsRegular>
            <Ionicons name="chevron-forward" size={22} color="#9b9a9e" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <PoppinsRegular style={styles.settingsItemText}>
              {i18n.t("Appearance")}
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
      <EmojiBottomSheet ref={EmojiBottomSheetRef} />

      {/* <Modal
        isVisible={}
        onBackdropPress={() => setMoodVisible(false)}
        onSwipeComplete={() => setMoodVisible(false)}
        swipeDirection="down"
        style={styles.modal}
      >
        <View style={styles.emojiContainer}>
          <PoppinsRegular style={styles.emojiPickerTitle}>
            Pick your mood
          </PoppinsRegular>
          <View style={styles.emojiGrid}>
            {[
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
            ].map((emoji) => (
              <TouchableOpacity
                key={emoji}
                onPress={() => {
                  setMood(emoji);
                  setMoodVisible(false);
                }}
                style={styles.emojiButton}
              >
                <PoppinsRegular style={{ fontSize: 28 }}>
                  {emoji}
                </PoppinsRegular>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal> */}
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#2a2933",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f0883e",
    marginBottom: 4, // add spacing between value and label
  },

  statLabel: {
    color: "#9b9a9e",
    fontSize: 14,
    textAlign: "center",
  },

  statSubLabel: {
    color: "#9b9a9e",
    fontSize: 12,
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
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 2,
  },
  emojiButton: {
    backgroundColor: "#444",
    padding: 6,
    borderRadius: 12,
    margin: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
});
