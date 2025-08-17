import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC8XbRlvuC0f9oJwVf24-rSzX0RLSC5TSI",
  authDomain: "notesy-a3468.firebaseapp.com",
  projectId: "notesy-a3468",
  storageBucket: "notesy-a3468.firebasestorage.app",
  messagingSenderId: "720447269366",
  appId: "1:720447269366:web:7a19e9051ec9f943c37fd7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
