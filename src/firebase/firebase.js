import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDq2tmIXzYJqKQT4c05vZU7tyofxDEW2Nc",
  authDomain: "career-os-cdf1c.firebaseapp.com",
  projectId: "career-os-cdf1c",
  storageBucket: "career-os-cdf1c.firebasestorage.app",
  messagingSenderId: "895954125156",
  appId: "1:895954125156:web:a1d03cbc421b326e38ba71",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;