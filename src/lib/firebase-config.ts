// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "mongo-market",
  appId: "1:774351319222:web:a6217c0a851167b2039a51",
  storageBucket: "mongo-market.appspot.com",
  apiKey: "AIzaSyAzgGNCf_vCgqXf-Gz8i_3G94y5eLajd-o",
  authDomain: "mongo-market.firebaseapp.com",
  messagingSenderId: "774351319222",
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
