import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import challenges from "@/assets/data/challenges.json";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import Avatar from "../components/Avatar";
import { useUser } from "../contexts/UserContext";

const Challenges = () => {
  const router = useRouter();
  const [streak, setStreak] = useState(0);
  const [activeTab, setActiveTab] = useState("challenges"); // challenges or leaderboard
  const [users, setUsers] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { data } = useUser();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("points", "desc"), limit(25));
        const querySnapshot = await getDocs(q);

        const queryData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(queryData);

        const rankIndex = queryData.findIndex(
          (user: any) => user.id === data.uid
        );
        setUserRank(rankIndex >= 0 ? rankIndex + 1 : null);
      } catch (error) {
        console.error("Error fetching top users:", error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const checkStreak = async () => {
    try {
      const lastOpened = await AsyncStorage.getItem("lastOpened");
      const storedStreak = await AsyncStorage.getItem("streak");

      const today = new Date().toDateString();
      if (lastOpened === today) {
        return; // Already opened today, do nothing
      }

      if (lastOpened) {
        const lastDate = new Date(lastOpened);
        const today = new Date(new Date().toDateString());
        const difference = Math.floor(
          (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        ); // Difference in days

        if (difference === 1) {
          // User came back the next day, increase streak
          const newStreak = parseInt(storedStreak || "0") + 1;
          setStreak(newStreak);
          await AsyncStorage.setItem("streak", newStreak.toString());
        } else {
          // User skipped a day, reset streak
          setStreak(1);
          await AsyncStorage.setItem("streak", "1");
        }
      } else {
        // First time opening the app
        setStreak(1);
        await AsyncStorage.setItem("streak", "1");
      }

      // Update last opened date
      await AsyncStorage.setItem("lastOpened", today);
    } catch (error) {
      console.error("Error checking streak:", error);
    }
  };

  useEffect(() => {
    checkStreak();
  }, []);

  if (loading || !userRank) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar barStyle="light-content" />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#1c1b22",
          }}
        >
          <Ionicons name="hourglass-outline" size={32} color="#fff" />
          <Text
            style={{
              marginTop: 12,
              fontSize: 16,
              color: "#9b9a9e",
              fontWeight: "500",
            }}
          >
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const ChallengeList = () => {
    return (
      <>
        {/* Streak Card */}
        <View style={styles.streakContainer}>
          <Text style={styles.streakText}>{streak} Days Streak 🔥</Text>
        </View>

        {/* Challenge List */}
        <FlatList
          data={challenges}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.challengeItem}
              onPress={() => router.push(`/challenge/${item.title}`)}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${item.color}20` },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={item.color}
                />
              </View>
              <View style={styles.challengeContent}>
                <Text style={styles.challengeText}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
              <View style={styles.pointsContainer}>
                <Text style={styles.pointsText}>{item.points}p</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </>
    );
  };

  const Leaderboard = () => {
    return (
      <>
        {/* Your points card */}
        <View style={styles.yourPointsContainer}>
          <View style={styles.pointsCircle}>
            <Text style={styles.yourPointsValue}>{data.points}</Text>
          </View>
          <View style={styles.yourPointsInfo}>
            <Text style={styles.yourPointsLabel}>Your Points</Text>
            <Text style={styles.yourRank}>
              {userRank ? `Rank #${userRank}` : "Unranked"}
            </Text>
          </View>
        </View>

        {/* Leaderboard List */}
        <FlatList
          data={users}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={styles.listContainer}
          
          renderItem={({ item, index }) => (
            <View style={styles.leaderboardItem}>
              <Text style={styles.rankText}>#{index + 1}</Text>
              <View style={{ marginRight: 8 }}>
                <Avatar
                  size={40}
                  initials={item.firstName[0] + item.lastName[0]}
                  uri={item.image}
                />
              </View>
              <Text style={styles.nameText}>
                {item.firstName + " " + item.lastName}
              </Text>
              <View style={styles.pointsContainer}>
                <Text style={styles.pointsText}>{item.points}p</Text>
              </View>
            </View>
          )}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" />

      {/* Header with Tabs */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "challenges" && styles.activeTab]}
            onPress={() => setActiveTab("challenges")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "challenges" && styles.activeTabText,
              ]}
            >
              Challenges
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "leaderboard" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("leaderboard")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "leaderboard" && styles.activeTabText,
              ]}
            >
              Leaderboard
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content based on active tab */}
      {activeTab === "challenges" ? <ChallengeList /> : <Leaderboard />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1b22",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  tabsContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#2a2933",
    borderRadius: 20,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 16,
  },
  activeTab: {
    backgroundColor: "#3b3946",
  },
  tabText: {
    color: "#9b9a9e",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2933",
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
    marginLeft: 10,
    color: "#FFC107",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  challengeItem: {
    flexDirection: "row",
    backgroundColor: "#2a2933",
    borderRadius: 12,
    marginBottom: 10,
    padding: 16,
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  challengeContent: {
    flex: 1,
  },
  challengeText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#9b9a9e",
    marginTop: 4,
  },
  pointsContainer: {
    backgroundColor: "#3b3946",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pointsText: {
    fontSize: 14,
    color: "#f0883e",
    fontWeight: "bold",
  },
  yourPointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2933",
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
  },
  pointsCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(240, 136, 62, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  yourPointsValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f0883e",
  },
  yourPointsInfo: {
    flex: 1,
  },
  yourPointsLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  yourRank: {
    color: "#9b9a9e",
    fontSize: 14,
  },
  leaderboardItem: {
    flexDirection: "row",
    backgroundColor: "#2a2933",
    borderRadius: 12,
    marginBottom: 10,
    padding: 16,
    alignItems: "center",
  },
  rankText: {
    width: 30,
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  avatarText: {
    fontSize: 24,
    marginRight: 12,
  },
  nameText: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
});

export default Challenges;
