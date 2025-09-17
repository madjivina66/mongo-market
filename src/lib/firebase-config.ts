
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-5118145902-ea04a",
  "appId": "1:870908828298:web:ddb21620337475c8402b73",
  "storageBucket": "studio-5118145902-ea04a.firebasestorage.app",
  "apiKey": "AIzaSyBcqpvacRbpfZEDbfnzeFdV-dFbVsNDneg",
  "authDomain": "studio-5118145902-ea04a.firebaseapp.com",
  "messagingSenderId": "870908828298",
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
