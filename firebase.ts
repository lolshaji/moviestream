// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// 🔑 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAcG4lkRGlxgaVb6kJqat2a9EGJNZN8-bc",
  authDomain: "lolan-62ffc.firebaseapp.com",
  projectId: "lolan-62ffc",
  storageBucket: "lolan-62ffc.appspot.com", // ✅ fixed domain (must be .appspot.com)
  messagingSenderId: "752319584309",
  appId: "1:752319584309:web:3abbddeba8fd3fd63fb97c",
  measurementId: "G-C97FTLJX69",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export services
export const db = getFirestore(app);    // Firestore Database
export const auth = getAuth(app);       // Authentication
export const storage = getStorage(app); // Storage (for images/videos/posters)

export default app;

