import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import LabeledInput from "../components/LabeledInput";
import { useSession } from "@/src/contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

const SignIn = () => {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    try {
      setLoading(true);
      await signIn(email, password);
    } catch (error) {
      console.error("Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      // Implement Google Sign In
      console.log("Google Sign In");
    } catch (error) {
      console.error("Google Sign In failed");
    }
  };

  const handleAppleSignIn = async () => {
    try {
      // Implement Apple Sign In
      console.log("Apple Sign In");
    } catch (error) {
      console.error("Apple Sign In failed");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.contentContainer}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
            />
            <Text style={styles.title}>MyJournal</Text>
            <Text style={styles.subtitle}>Your personal space for reflection</Text>
          </View>

          {/* Social Sign In Section */}
          <View style={styles.socialSection}>
            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
              onPress={handleGoogleSignIn}
            >
              <Ionicons name="logo-google" size={20} color="#fff" />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, styles.appleButton]}
              onPress={handleAppleSignIn}
            >
              <Ionicons name="logo-apple" size={20} color="#fff" />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.separatorContainer}>
            <View style={styles.separator} />
            <Text style={styles.orText}>or sign in with email</Text>
            <View style={styles.separator} />
          </View>

          {/* Email Sign In Section */}
          <View style={styles.formSection}>
            <LabeledInput
              label="Email"
              placeholder="Enter your email"
              theme="dark"
              iconLeft={
                <Ionicons name="mail-outline" size={16} color="#9b9a9e" />
              }
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <LabeledInput
              label="Password"
              placeholder="Enter your password"
              theme="dark"
              iconLeft={
                <Ionicons
                  name="lock-closed-outline"
                  size={16}
                  color="#9b9a9e"
                />
              }
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              labelRight={
                <Link href="/forgot-password">
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </Link>
              }
            />

            <TouchableOpacity
              style={[
                styles.signInButton,
                (!email || !password) && styles.signInButtonDisabled
              ]}
              onPress={handleSignIn}
              disabled={loading || !email || !password}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signInButtonText}>Sign in</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
            <Text style={styles.footerText}>
              Don't have an account?{" "}
              <Link href="/signup" asChild>
                <Text style={styles.signUpLink}>Sign up</Text>
              </Link>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1b22",
  },
  keyboardView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    borderRadius: 40,
    backgroundColor: "#2a2933",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#9b9a9e",
    textAlign: "center",
  },
  socialSection: {
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  googleButton: {
    backgroundColor: "#2a2933",
  },
  appleButton: {
    backgroundColor: "#2a2933",
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: "#2a2933",
  },
  orText: {
    color: "#9b9a9e",
    marginHorizontal: 12,
    fontSize: 14,
  },
  formSection: {
    gap: 16,
  },
  signInButton: {
    backgroundColor: "#6366f1",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  signInButtonDisabled: {
    opacity: 0.5,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPassword: {
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "500",
  },
  footerSection: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    color: "#9b9a9e",
    fontSize: 14,
  },
  signUpLink: {
    color: "#6366f1",
    fontWeight: "600",
  },
});

export default SignIn;

