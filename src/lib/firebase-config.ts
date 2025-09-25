
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// =======================================================================
// CONFIGURATION FIREBASE DIRECTEMENT INTÉGRÉE
// =======================================================================
// Pour résoudre l'erreur persistante, la configuration est maintenant
// directement dans le code. C'est la méthode la plus fiable dans ce contexte.
// =======================================================================

const firebaseConfig = {
  apiKey: "AIzaSyBcqpvacRbpfZEDbfnzeFdV-dFbVsNDneg",
  authDomain: "studio-5118145902-ea04a.firebaseapp.com",
  projectId: "studio-5118145902-ea04a",
  storageBucket: "studio-5118145902-ea04a.firebasestorage.app",
  messagingSenderId: "870908828298",
  appId: "1:870908828298:web:ddb21620337475c8402b73",
  measurementId: ""
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
