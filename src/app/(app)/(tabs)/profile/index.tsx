import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for dummy icons
import { Stack, useRouter } from "expo-router";
import { useUser } from "@/src/contexts/UserContext";
import UserAvatar from "@/src/components/UserAvatar";
import { useSession } from "@/src/contexts/AuthContext";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import Avatar from "@/src/components/Avatar";

const ProfileScreen = () => {
  const router = useRouter();
  const { data, loading } = useUser();
  const { signOut } = useSession();
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/chicken-jockey.mp3") // or a URL string
    );
    setSound(sound);
    await sound.playAsync();
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); // clean up on unmount
        }
      : undefined;
  }, [sound]);

  function handleLogout() {
    signOut();
  }

  async function handleCopy() {
    playSound();
    await Clipboard.setStringAsync(data.friendCode);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header / Profile Info */}
        <View style={styles.header}>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            {/* Dummy profile icon instead of a profile image */}
            <UserAvatar size={50} canUpload={true} />
            <Text style={styles.userName}>
              {data.firstName} {data.lastName}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "500",
                marginRight: 8,
              }}
            >
              Friend code: {data.friendCode}
            </Text>

            <Pressable onPress={handleCopy}>
              <Ionicons name="copy-outline" size={20} color="#9b9a9e" />
            </Pressable>
          </View>

          {/* Mood Section */}
          <TouchableOpacity style={styles.moodButton}>
            <Text style={styles.moodButtonText}>Set mood</Text>
            <Text style={styles.moodEmoji}>😊</Text>
          </TouchableOpacity>
        </View>

        {/* Friends */}
        <View style={styles.friendsContainer}>
          <View style={styles.friendsTitleRow}>
            <Text style={styles.friendsTitle}>
              {data.friends?.length || "0"} friends
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(app)/(modals)/friends")}
            >
              <Text style={{ color: "#9b9a9e", fontSize: 16 }}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.friendsAvatars}>
            {data.friends?.length > 0 ? (
              <ScrollView horizontal>
                {data.friends.map((friend: any) => {
                  <Avatar
                    size={24}
                    initials={friend.firstName + " " + friend.lastName}
                    uri={friend.image}
                  />;
                })}
              </ScrollView>
            ) : (
              <Text style={{ fontWeight: 500, color: "#9b9a9e" }}>
                No friends
              </Text>
            )}
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>16 days</Text>
            <Text style={styles.statLabel}>Current streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>32</Text>
            <Text style={styles.statLabel}>Entries this year</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>9,029</Text>
            <Text style={styles.statLabel}>Words Written</Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsContainer}>
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => router.push("/profile/account-info")}
          >
            <Text style={styles.settingsItemText}>Account info</Text>
            <Text style={styles.settingsItemArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={[
            {
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderRadius: 10,
              alignItems: "center",
              marginTop: 20,
            },
            { backgroundColor: "#2a2933" },
          ]}
        >
          <Text
            style={{
              color: "#ff6b6b",
              fontFamily: "dm-sb",
              fontSize: 16,
            }}
          >
            Log out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

// -----------------
//      STYLES
// -----------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1b22",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "#2a2933",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileIcon: {
    marginRight: 12,
  },
  userName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  moodButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b3946",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  moodButtonText: {
    color: "#fff",
    marginRight: 8,
  },
  moodEmoji: {
    fontSize: 18,
  },
  friendsContainer: {
    backgroundColor: "#2a2933",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  friendsTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  friendsTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  friendsAvatars: {
    flexDirection: "row",
  },
  friendIcon: {
    marginRight: 8,
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
    alignItems: "center",
  },
  statValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  statLabel: {
    color: "#9b9a9e",
    fontSize: 12,
    marginTop: 4,
  },
  settingsContainer: {
    backgroundColor: "#2a2933",
    borderRadius: 12,
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  settingsItemText: {
    color: "#fff",
    fontSize: 16,
  },
  settingsItemArrow: {
    color: "#9b9a9e",
    fontSize: 16,
  },
});
