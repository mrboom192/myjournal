import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useUser } from "@/src/contexts/UserContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import Colors from "@/src/constants/Colors";

const AccountInfo = () => {
  const { data } = useUser();

  const original = {
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone || "",
    dateOfBirth: data.dateOfBirth?.toDate
      ? data.dateOfBirth.toDate()
      : new Date(),
    gender:
      data.gender === "male" || data.gender === "female" ? data.gender : "",
  };

  const [firstName, setFirstName] = useState(original.firstName);
  const [lastName, setLastName] = useState(original.lastName);
  const [loading, setLoading] = useState(false);

  const hasChanges =
    firstName !== original.firstName || lastName !== original.lastName;

  const handleSave = async () => {
    setLoading(true);
    try {
      await setDoc(
        doc(db, "users", data.uid),
        { firstName, lastName },
        { merge: true }
      );
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Something went wrong saving your info.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.background,
      }}
    >
      <Stack.Screen
        options={{
          title: "Account info",
          headerTitleStyle: { fontFamily: "dm-sb", color: "#fff" },
          headerStyle: { backgroundColor: Colors.background },
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />

      <ScrollView>
        <View
          style={{
            backgroundColor: "#2a2933",
            borderRadius: 12,
            padding: 16,
            marginHorizontal: 16,
          }}
        >
          <Text style={styles.label}>First name</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
            placeholderTextColor="#7a7981"
            style={styles.input}
          />

          <Text style={styles.label}>Last name</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter last name"
            placeholderTextColor="#7a7981"
            style={styles.input}
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveContainer}>
        <Pressable
          onPress={handleSave}
          disabled={!hasChanges || loading}
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor:
                !hasChanges || loading ? "#3b3946" : pressed ? "#111" : "#000",
            },
          ]}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Saving..." : "Save"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AccountInfo;

// -----------------
//     STYLES
// -----------------
const styles = StyleSheet.create({
  label: {
    color: "#fff",
    fontFamily: "dm",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#3b3946",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontFamily: "dm",
    marginBottom: 16,
  },
  saveContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#3b3946",
    backgroundColor: Colors.background,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontFamily: "dm-sb",
    fontSize: 16,
  },
});
