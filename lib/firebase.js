// Firebase configuration
// You'll need to replace these with your actual Firebase config values
// Get these from your Firebase project settings

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Prevent re-initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let auth = null;
let db = null;

if (typeof window !== 'undefined') {
  auth = getAuth(app);
  setPersistence(auth, browserSessionPersistence).catch((err) => {
    console.error("Failed to set session persistence:", err);
  });
  db = getFirestore(app);
}

export { app, auth, db }; 