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
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for icons
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

        {/* Mood Section */}
        <TouchableOpacity style={styles.moodButton}>
          <Text style={styles.moodButtonText}>Set mood</Text>
          <Text style={styles.moodEmoji}>😊</Text>
        </TouchableOpacity>

        {/* Friends */}
        <View style={styles.friendsSection}>
          <View style={styles.friendsTitleRow}>
            <Text style={styles.sectionTitle}>
              {data.friends?.length || "6"} Friends
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(app)/(modals)/friends")}
            >
              <Text style={styles.seeAllText}>See all <Ionicons name="chevron-forward" size={16} color="#9b9a9e" /></Text>
            </TouchableOpacity>
          </View>
          <View style={styles.friendsAvatars}>
            {data.friends?.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {/* For demo, show placeholder avatars if no friends */}
                {(data.friends.length > 0 ? data.friends : Array(6).fill(null)).map((friend: any, index: number) => (
                  <View key={index} style={styles.friendAvatarContainer}>
                    <Avatar
                      size={40}
                      initials={friend?.firstName ? friend.firstName[0] + friend.lastName[0] : ""}
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

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>16</Text>
            <Text style={styles.statLabel}>days</Text>
            <Text style={styles.statSubLabel}>Current streak</Text>
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
        <Text style={styles.settingsHeader}>Settings</Text>
        <View style={styles.settingsContainer}>
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => router.push("/profile/account-info")}
          >
            <Text style={styles.settingsItemText}>Account info</Text>
            <Ionicons name="chevron-forward" size={22} color="#9b9a9e" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingsItem}>
            <Text style={styles.settingsItemText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={22} color="#9b9a9e" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingsItem}>
            <Text style={styles.settingsItemText}>Language</Text>
            <Ionicons name="chevron-forward" size={22} color="#9b9a9e" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingsItem}>
            <Text style={styles.settingsItemText}>Appearance</Text>
            <Ionicons name="chevron-forward" size={22} color="#9b9a9e" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutButtonText}>Log out</Text>
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
});
