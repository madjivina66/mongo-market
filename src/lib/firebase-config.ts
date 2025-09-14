// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// This is a public configuration and it's safe to be exposed.
const firebaseConfig = {
  "projectId": "mongo-market",
  "appId": "1:331430267761:web:d5523450d0bb566270b201",
  "storageBucket": "mongo-market.appspot.com",
  "apiKey": "AIzaSyCV_2UFEAcw_G7hT5U-a_8h3eS4P2I3e0Y",
  "authDomain": "mongo-market.firebaseapp.com",
  "messagingSenderId": "331430267761"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
