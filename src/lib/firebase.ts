import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAcE0TtsEEavmOcnmkm_ve6LL8WI2NH_Ss",
  authDomain: "circuit-digest-19-05-26.firebaseapp.com",
  projectId: "circuit-digest-19-05-26",
  storageBucket: "circuit-digest-19-05-26.firebasestorage.app",
  messagingSenderId: "708199794955",
  appId: "1:708199794955:web:a228bed672f1dbc2aa3a0e",
  measurementId: "G-DX3TFSDXMQ"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
