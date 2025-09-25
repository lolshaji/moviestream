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