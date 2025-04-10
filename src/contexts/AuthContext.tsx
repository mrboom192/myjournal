import { useContext, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "../hooks/useStorageState";
import { auth, db } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { router } from "expo-router";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, data: object) => Promise<void>;
  signOut: () => Promise<void>;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  async function signUp(email: string, password: string, data: object) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const friendCode = await generateFriendCode(user.uid);

      // Store user information in Firestore, merging user-specific data
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        uid: user.uid,
        friendCode,
        ...data, // Spread additional user information
      });

      setSession(user.uid); // Save the new user ID or token to the session
      router.replace("/"); // Lets go home!!!
    } catch (e: any) {
      const err = e as FirebaseError;
      alert("Registration failed: " + err.message);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save the user UID or token to session state
      setSession(user.uid); // Or user.email or user.getIdToken() for token
      router.replace("/"); // Lets go home!!!
    } catch (error) {
      console.error("Error signing in:", error);
      throw error; // Re-throw to handle errors in the UI
    }
  }

  async function signOutUser() {
    try {
      await signOut(auth);
      setSession(null); // Clear the session
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{ signIn, signUp, signOut: signOutUser, session, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Utility to generate a short alphanumeric code
const generateFriendCode = (uid: string) => {
  // Use the last 6–8 characters of UID, or hash if needed
  return uid.slice(-8);
};
