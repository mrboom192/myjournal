// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDr0kHgm0oytM7m7j0lYY1AsmRbwkymO0Q",
  authDomain: "myjournal-f1f2b.firebaseapp.com",
  projectId: "myjournal-f1f2b",
  storageBucket: "myjournal-f1f2b.firebasestorage.app",
  messagingSenderId: "376868191768",
  appId: "1:376868191768:web:12040a7c206c4b3a538d6d",
  measurementId: "G-KTMSVSY8KB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firebase Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db };

const analytics = getAnalytics(app);
