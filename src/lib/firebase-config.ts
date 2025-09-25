// Ce fichier n'est plus la source principale d'initialisation.
// La nouvelle structure se trouve dans /src/firebase/
// Nous le gardons pour les fonctions getDb qui sont encore utilisées ailleurs
// mais nous devrions migrer cela à terme.

import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getApp } from "firebase/app";

// Note: initializeApp est maintenant géré dans src/firebase/index.ts

let db: Firestore;
let auth: Auth;

function getDb() {
    if (!db) {
        db = getFirestore(getApp());
    }
    return db;
}

function getAuthInstance() {
    if (!auth) {
        auth = getAuth(getApp());
    }
    return auth;
}


export { getDb, getAuthInstance };
