<<<<<<< HEAD
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCaigmrKu1u0PYAe397pHQafl5fMSZi7dU",
  authDomain: "moviestream-f49bc.firebaseapp.com",
  projectId: "moviestream-f49bc",
  storageBucket: "moviestream-f49bc.firebasestorage.app",
  messagingSenderId: "236479292139",
  appId: "1:236479292139:web:291929d4d8b8db0a80d4ae",
  measurementId: "G-5V75FHGJE2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
=======
// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// 🔑 Firebase config (loaded from Vite env variables)
// Make sure you add these to your `.env.local` file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export services
export const db = getFirestore(app);    // Firestore Database
export const auth = getAuth(app);       // Authentication
export const storage = getStorage(app); // Storage (images/videos/posters)

export default app;


>>>>>>> 9ee50d98492dc7e9af71d91c905fca21b2bb45bf
