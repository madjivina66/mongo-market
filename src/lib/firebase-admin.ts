
import admin from 'firebase-admin';

// Dans un environnement Google Cloud comme celui-ci, appeler initializeApp()
// sans argument est souvent la méthode la plus fiable. Le SDK détecte
// automatiquement les informations du projet et les identifiants.
if (!admin.apps.length) {
  admin.initializeApp();
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
