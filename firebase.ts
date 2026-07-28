import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpMEBhCbG8lENX_WvK5J4w_piF3NEraNQ",
  authDomain: "alphamindai-b77ba.firebaseapp.com",
  projectId: "alphamindai-b77ba",
  storageBucket: "alphamindai-b77ba.firebasestorage.app",
  messagingSenderId: "642538265280",
  appId: "1:642538265280:web:df5769ba51b0d6317eab25",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
