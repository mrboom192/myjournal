import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
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

  const handleGoogleSignUp = async () => {
    try {
      // Implement Google Sign Up
      console.log("Google Sign Up");
    } catch (error) {
      console.error("Google Sign Up failed");
    }
  };

  const handleAppleSignUp = async () => {
    try {
      // Implement Apple Sign Up
      console.log("Apple Sign Up");
    } catch (error) {
      console.error("Apple Sign Up failed");
    }
  };

  const isFormValid = () => {
    return (
      signUpData.email?.trim() &&
      signUpData.password?.trim() &&
      signUpData.firstName?.trim() &&
      signUpData.lastName?.trim()
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            {/* Header */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              disabled={submitting}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={submitting ? "#9b9a9e" : "#fff"}
              />
              <Text style={styles.backButtonText}>Back to login</Text>
            </TouchableOpacity>

            <View style={styles.headerSection}>
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
              />
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join MyJournal and start your journaling journey
              </Text>
            </View>

            {/* Social Sign Up Section */}
            <View style={styles.socialSection}>
              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton]}
                onPress={handleGoogleSignUp}
                disabled={submitting}
              >
                <Ionicons name="logo-google" size={20} color="#fff" />
                <Text style={styles.socialButtonText}>
                  Continue with Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.appleButton]}
                onPress={handleAppleSignUp}
                disabled={submitting}
              >
                <Ionicons name="logo-apple" size={20} color="#fff" />
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.separatorContainer}>
              <View style={styles.separator} />
              <Text style={styles.orText}>or sign up with email</Text>
              <View style={styles.separator} />
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <View style={styles.nameRow}>
                <View style={styles.nameInput}>
                  <Text style={styles.label}>First name</Text>
                  <TextInput
                    editable={!submitting}
                    style={styles.input}
                    placeholder="First name"
                    placeholderTextColor="#9b9a9e"
                    value={signUpData.firstName}
                    onChangeText={(text) => setSignUpData({ firstName: text })}
                  />
                </View>

                <View style={styles.nameInput}>
                  <Text style={styles.label}>Last name</Text>
                  <TextInput
                    editable={!submitting}
                    style={styles.input}
                    placeholder="Last name"
                    placeholderTextColor="#9b9a9e"
                    value={signUpData.lastName}
                    onChangeText={(text) => setSignUpData({ lastName: text })}
                  />
                </View>
              </View>

              <Text style={styles.label}>Email</Text>
              <TextInput
                editable={!submitting}
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#9b9a9e"
                value={signUpData.email}
                onChangeText={(text) => setSignUpData({ email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  editable={!submitting}
                  style={styles.passwordInput}
                  placeholder="Create a password"
                  placeholderTextColor="#9b9a9e"
                  secureTextEntry={!showPassword}
                  value={signUpData.password}
                  onChangeText={(text) => setSignUpData({ password: text })}
                />
                <TouchableOpacity
                  disabled={submitting}
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#9b9a9e"
                  />
                </TouchableOpacity>
              </View>

              {/* Terms */}
              <Text style={styles.terms}>
                By selecting Create account, I agree to MyJournal's{" "}
                <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>.
              </Text>

              {/* Create Account Button */}
              <TouchableOpacity
                disabled={submitting || !isFormValid()}
                style={[
                  styles.createButton,
                  (!isFormValid() || submitting) && styles.createButtonDisabled,
                ]}
                onPress={handleSignUp}
              >
                <Text style={styles.createButtonText}>
                  {submitting ? "Creating account..." : "Create account"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingTop: Platform.OS === "ios" ? 0 : 24,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 16,
    borderRadius: 32,
    backgroundColor: "#2a2933",
  },
  title: {
    fontSize: 28,
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
  nameRow: {
    flexDirection: "row",
    gap: 12,
  },
  nameInput: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#fff",
    fontWeight: "500",
  },
  input: {
    borderColor: "#2a2933",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#2a2933",
    color: "#fff",
  },
  passwordContainer: {
    borderColor: "#2a2933",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2933",
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
    color: "#fff",
  },
  eyeButton: {
    padding: 8,
  },
  terms: {
    fontSize: 14,
    color: "#9b9a9e",
    textAlign: "left",
    lineHeight: 20,
  },
  termsLink: {
    color: "#6366f1",
    textDecorationLine: "underline",
  },
  createButton: {
    backgroundColor: "#6366f1",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SignUp;
