import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRUoS-7eTbMgBfyFNaiNKdm6hpnrl1eL0",
  authDomain: "chat-2117c.firebaseapp.com",
  projectId: "chat-2117c",
  storageBucket: "chat-2117c.appspot.com",
  messagingSenderId: "439084894280",
  appId: "1:439084894280:web:af35d0ec37369188a4707d",
  measurementId: "G-M9P9MDK28V"
};

export const app = initializeApp(firebaseConfig);
export const databaseApp = getFirestore(app);
