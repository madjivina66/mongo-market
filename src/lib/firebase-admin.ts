
// Ce fichier est destiné UNIQUEMENT au côté serveur (Server Actions, API Routes).
// NE PAS l'importer dans des composants client.
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';

// Cette fonction garantit que l'application admin est initialisée une seule fois (modèle singleton).
export async function initializeAdminApp(): Promise<App> {
  const apps = getApps();
  const adminApp = apps.find(app => app.name === 'firebase-admin-app');

  if (adminApp) {
    return adminApp;
  }

  // Les identifiants de service sont passés via une variable d'environnement
  // C'est la méthode sécurisée pour fournir des informations sensibles au serveur.
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountString) {
    throw new Error('La variable d\'environnement FIREBASE_SERVICE_ACCOUNT_KEY n\'est pas définie. Impossible d\'initialiser le SDK Admin.');
  }
  
  const serviceAccount = JSON.parse(serviceAccountString);

  return initializeApp({
    credential: cert(serviceAccount),
  }, 'firebase-admin-app');
}
