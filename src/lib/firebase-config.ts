
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// =======================================================================
// ATTENTION : ACTION REQUISE
// =======================================================================
// Veuillez remplacer l'objet firebaseConfig ci-dessous par le vôtre.
// Vous pouvez trouver votre objet de configuration dans votre console Firebase :
// 1. Allez dans les paramètres de votre projet Firebase.
// 2. Dans l'onglet "Général", faites défiler jusqu'à "Vos applications".
// 3. Sélectionnez votre application web.
// 4. Choisissez l'option "Config" pour voir l'objet de configuration.
// 5. Copiez et collez l'intégralité de l'objet ici.
// =======================================================================

const firebaseConfig = {
  // COLLEZ VOTRE CONFIGURATION FIREBASE ICI
  // Exemple :
  // apiKey: "AIza....",
  // authDomain: "votre-projet.firebaseapp.com",
  // projectId: "votre-projet",
  // storageBucket: "votre-projet.appspot.com",
  // messagingSenderId: "...",
  // appId: "1:..."
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
