// src/firebase-config.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCmZ6sPF_4ujJaa_B4EfUK37pm5R3UIdVg",
  authDomain: "gamified-dashboard-769b3.firebaseapp.com",
  projectId: "gamified-dashboard-769b3",
  storageBucket: "gamified-dashboard-769b3.firebasestorage.app",
  messagingSenderId: "327774202218",
  appId: "1:327774202218:web:e4ccf2125cc7f5f6599d13",
  measurementId: "G-BQXMRCHDR3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and database
export const auth = getAuth(app);
export const db = getFirestore(app);
