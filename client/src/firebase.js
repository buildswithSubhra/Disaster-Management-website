import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6LbaIJSF6-XadpMa4zwb2sPnZ7Dymfgg",
  authDomain: "disaster-management-syst-c9c01.firebaseapp.com",
  projectId: "disaster-management-syst-c9c01",
  storageBucket: "disaster-management-syst-c9c01.firebasestorage.app",
  messagingSenderId: "732500948427",
  appId: "1:732500948427:web:1826d73e9de90725d2324e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
