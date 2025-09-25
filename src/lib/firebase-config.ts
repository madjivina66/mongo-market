
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

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
  storageBucket: "studio-5118145902-ea04a.appspot.com",
  messagingSenderId: "870908828298",
  appId: "1:870908828298:web:ddb21620337475c8402b73",
  measurementId: ""
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Initialize Firebase
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

function getDb() {
    if (!db) {
        db = getFirestore(app);
    }
    return db;
}

function getAuthInstance() {
    if (!auth) {
        auth = getAuth(app);
    }
    return auth;
}


export { getDb, getAuthInstance };
