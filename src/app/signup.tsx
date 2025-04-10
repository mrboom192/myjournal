import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import Colors from "../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useSignUp } from "../contexts/SignupContext";
import { useSession } from "../contexts/AuthContext";

const SignUp = () => {
  const { signUpData, setSignUpData } = useSignUp();
  const { signUp } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSignUp = async () => {
    const { email, password, ...userInfo } = signUpData;

    try {
      setSubmitting(true);
      await signUp(email, password, userInfo);
    } catch (e) {
      // Already handled in the context, but you could add UI feedback here
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 32,
          paddingBottom: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          disabled={submitting}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={submitting ? "#aaa" : "#000"}
          />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 20,
            fontFamily: "dm-sb",
            marginVertical: 24,
            textAlign: "center",
          }}
        >
          Finish signing up
        </Text>

        {/* First Name */}
        <Text style={{ fontFamily: "dm", fontSize: 14, marginBottom: 6 }}>
          First name
        </Text>
        <TextInput
          editable={!submitting}
          style={{
            borderColor: Colors.light.faintGrey,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontSize: 16,
            fontFamily: "dm",
            marginBottom: 16,
          }}
          placeholder="e.g. John"
          value={signUpData.firstName}
          onChangeText={(text) => setSignUpData({ firstName: text })}
        />

        {/* Last Name */}
        <Text style={{ fontFamily: "dm", fontSize: 14, marginBottom: 6 }}>
          Last name
        </Text>
        <TextInput
          editable={!submitting}
          style={{
            borderColor: Colors.light.faintGrey,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontSize: 16,
            fontFamily: "dm",
            marginBottom: 16,
          }}
          placeholder="e.g. Smith"
          value={signUpData.lastName}
          onChangeText={(text) => setSignUpData({ lastName: text })}
        />

        {/* Email*/}
        <Text style={{ fontFamily: "dm", fontSize: 14, marginBottom: 6 }}>
          Email
        </Text>
        <TextInput
          editable={!submitting}
          style={{
            borderColor: Colors.light.faintGrey,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontSize: 16,
            fontFamily: "dm",
            marginBottom: 16,
          }}
          placeholder="e.g. johnsmith@email.com"
          value={signUpData.email}
          onChangeText={(text) => setSignUpData({ email: text })}
        />

        {/* Password */}
        <Text style={{ fontFamily: "dm", fontSize: 14, marginBottom: 6 }}>
          Password
        </Text>
        <View
          style={{
            borderColor: Colors.light.faintGrey,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 4,
            marginBottom: 16,
          }}
        >
          <TextInput
            editable={!submitting}
            style={{
              flex: 1,
              fontSize: 16,
              fontFamily: "dm",
              paddingVertical: 10,
            }}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={signUpData.password}
            onChangeText={(text) => setSignUpData({ password: text })}
          />
          <TouchableOpacity
            disabled={submitting}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={Colors.light.grey}
            />
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <Text
          style={{
            fontSize: 12,
            color: "#666",
            textAlign: "center",
            fontFamily: "dm",
            lineHeight: 16,
            marginBottom: 24,
          }}
        >
          By selecting Agree and continue, I agree to MyJournal's{" "}
          <Text style={{ textDecorationLine: "underline" }}>
            Terms of Service, Payments Terms of Service and Nondiscrimination
            Policy
          </Text>{" "}
          and acknowledge the{" "}
          <Text style={{ textDecorationLine: "underline" }}>
            Privacy Policy
          </Text>
          .
        </Text>

        {/* Agree Button */}
        <TouchableOpacity
          disabled={submitting}
          style={{
            backgroundColor: "#000",
            borderRadius: 8,
            paddingVertical: 16,
            alignItems: "center",
          }}
          onPress={handleSignUp}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontFamily: "dm-sb",
            }}
          >
            {submitting ? "Signing up..." : "Agree and continue"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
