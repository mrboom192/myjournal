import React, { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import Modal from "react-native-modal";
import { v4 as uuidv4 } from "uuid";
import i18n from "@/src/locales";
import {
  doc,
  setDoc,
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
import { Audio } from "expo-av";
import Avatar from "@/src/components/Avatar";
import Colors from "@/src/constants/Colors";

const ProfileScreen = () => {
  const router = useRouter();
  const { data, loading } = useUser();
  const { signOut, session } = useSession();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [friendCodeInput, setFriendCodeInput] = useState("");
  const [showFriends, setShowFriends] = useState(false);
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [language, setLanguage] = useState(i18n.locale);
  const [, forceUpdate] = useState(0); // State to force re-render

  function handleLogout() {
    signOut();
  }

  async function handleCopy() {
    await Clipboard.setStringAsync(data.friendCode);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  const [mood, setMood] = useState("😊");
  const [isMoodVisible, setMoodVisible] = useState(false);

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
  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with profile and menu */}
        <View style={styles.profileHeader}>
          <View style={styles.profileRow}>
            <UserAvatar size={48} canUpload={true} />
            <Text style={styles.userName}>
              {data.firstName} {data.lastName}
            </Text>
          </View>
          <Pressable>
            <Ionicons name="ellipsis-horizontal" size={24} color="#9b9a9e" />
          </Pressable>
        </View>

        <View style={{ marginBottom: 20 }}>
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
          >
            <Text style={styles.sectionTitle}>
              {i18n.t("profile.addFriend")} {language}
            </Text>
            <Text style={{ color: "#fff", fontWeight: "500", fontSize: 16 }}>
              {data.friendCode.toUpperCase()}
            </Text>
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
            <Text style={styles.sectionTitle}>
              {i18n.t("profile.addFriend")}
            </Text>

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
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  {i18n.t("profile.add")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Friends- checks if the length is 0, 1, or more for plural form of friends*/}
        <View style={styles.friendsSection}>
          <View style={styles.friendsTitleRow}>
            <Text style={styles.sectionTitle}>
              {data.friends?.length === 0
                ? i18n.t("profile.noFriends")
                : `${data.friends.length} ${
                    data.friends.length === 1
                      ? i18n.t("profile.friend")
                      : i18n.t("profile.friends")
                  }`}
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/(app)/(modals)/friends")}
            >
              <Text style={styles.seeAllText}>
                {i18n.t("profile.seeAll")}{" "}
                <Ionicons name="chevron-forward" size={16} color="#9b9a9e" />
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.friendsAvatars}>
            {data.friends?.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {/* For demo, show placeholder avatars if no friends */}
                {(data.friends.length > 0
                  ? data.friends
                  : Array(6).fill(null)
                ).map((friend: any, index: number) => (
                  <View key={index} style={styles.friendAvatarContainer}>
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
            ) : (
              <Text style={{ fontWeight: "500", color: "#9b9a9e" }}>
                No friends
              </Text>
            )}
          </View>
        </View>

        {/* Mood*/}
        <TouchableOpacity
          style={styles.moodButton}
          onPress={() => setMoodVisible(true)}
        >
          <Text style={styles.moodButtonText}>{i18n.t("profile.mood")}</Text>
          <Text style={styles.moodEmoji}>{mood}</Text>
        </TouchableOpacity>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          {/* <View style={styles.statItem}>
           <Text style={styles.statValue}>16</Text>
           <Text style={styles.statLabel}>{i18n.t("profile.days")}</Text>
           <Text style={styles.statLabel}>{i18n.t("profile.currentStreak")}</Text>
         </View> */}
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>
              {i18n.t("profile.entriesThisYear")}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2,153</Text>
            <Text style={styles.statLabel}>
              {i18n.t("profile.wordsWritten")}
            </Text>
          </View>
        </View>

        {/* Settings */}
        <Text style={styles.settingsHeader}>{i18n.t("profile.settings")}</Text>
        <View style={styles.settingsContainer}>
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => router.push("/profile/account-info")}
          >
            <Text style={styles.settingsItemText}>
              {i18n.t("Account info")}
            </Text>
            <Ionicons name="chevron-forward" size={22} color="#9b9a9e" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <Text style={styles.settingsItemText}>
              {i18n.t("Notifications")}
            </Text>
            <Ionicons name="chevron-forward" size={22} color="#9b9a9e" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => setShowLanguageOptions(true)}
          >
            <Text style={styles.settingsItemText}>{i18n.t("Language")}</Text>
            <Ionicons name="chevron-forward" size={22} color="#9b9a9e" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <Text style={styles.settingsItemText}>{i18n.t("Appearance")}</Text>
            <Ionicons name="chevron-forward" size={22} color="#9b9a9e" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        isVisible={showLanguageOptions}
        onBackdropPress={() => setShowLanguageOptions(false)}
        style={styles.modal}
      >
        <View style={styles.languageContainer}>
          <Text style={styles.emojiPickerTitle}>Select Language</Text>

          <TouchableOpacity
            onPress={() => {
              i18n.locale = "en";
              setLanguageChanged((prev) => !prev); // force re-render
              setShowLanguageOptions(false);
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18, marginVertical: 8 }}>
              English
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              i18n.locale = "es";
              setLanguageChanged((prev) => !prev); // force re-render
              setShowLanguageOptions(false);
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18, marginVertical: 8 }}>
              Español
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        isVisible={isMoodVisible}
        onBackdropPress={() => setMoodVisible(false)}
        onSwipeComplete={() => setMoodVisible(false)}
        swipeDirection="down"
        style={styles.modal}
      >
        <View style={styles.emojiContainer}>
          <Text style={styles.emojiPickerTitle}>Pick your mood</Text>
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
                <Text style={{ fontSize: 28 }}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
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
    paddingBottom: 40,
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
    alignSelf: "flex-start",
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
    alignItems: "flex-start",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f0883e", // Orange color like in the image
  },
  statLabel: {
    color: "#9b9a9e",
    fontSize: 14,
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
  languageContainer: {
    backgroundColor: "#2a2933",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },

  emojiContainer: {
    position: "absolute",
    bottom: 0, // or top: '30%' if you prefer it in the middle
    left: 0,
    right: 0,
    backgroundColor: "#2a2933",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 100, // ensure it appears above other content
  },
  emojiPickerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 2,
  },
  emojiButton: {
    backgroundColor: "#444",
    padding: 5,
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
