// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTzjZ8cvP4JFeRobqJ-XxAkb5TD_NWhwA",
  authDomain: "chat-firestore-16fc1.firebaseapp.com",
  projectId: "chat-firestore-16fc1",
  storageBucket: "chat-firestore-16fc1.appspot.com",
  messagingSenderId: "700406218847",
  appId: "1:700406218847:web:88e24bce5c1ffcdbcb9bea",
  measurementId: "G-PVSZSYVXQQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
