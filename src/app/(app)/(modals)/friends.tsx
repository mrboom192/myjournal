import { View, Text, ScrollView } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { useUser } from "@/src/contexts/UserContext";
import Avatar from "@/src/components/Avatar";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import Colors from "@/src/constants/Colors";

const Friends = () => {
  const { data, loading } = useUser();
  if (loading) {
    return (
      <Text style={{ color: "white", textAlign: "center" }}>Loading...</Text>
    );
  }

  const friends = data?.friends || [];
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        gap: 16,
        padding: 26,
        backgroundColor: "#2a2933",
      }}
    >
      <Stack.Screen
        options={{
          title: "Your Friends",
          headerTintColor: "white",
          headerStyle: { backgroundColor: Colors.background },
          headerRight: () => (
            <Pressable
              onPress={() => router.back()}
              style={{ marginRight: 12 }}
            >
              <Ionicons name="close" size={24} color="white" />
            </Pressable>
          ),
        }}
      />

      {friends.length === 0 ? (
        <Text style={{ color: "#9b9a9e", textAlign: "center", marginTop: 20 }}>
          You haven’t added any friends yet!
        </Text>
      ) : (
        <ScrollView
          contentContainerStyle={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          {friends.map((friend: any, index: number) => (
            <View key={index} style={{ alignItems: "center", width: 80 }}>
              <Avatar
                size={60}
                initials={
                  friend.firstName && friend.lastName
                    ? friend.firstName[0] + friend.lastName[0]
                    : ""
                }
                uri={friend?.image || undefined}
              />
              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  textAlign: "center",
                  marginTop: 6,
                }}
              >
                {friend.firstName} {friend.lastName}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default Friends;
