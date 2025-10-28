// Ce fichier est destiné UNIQUEMENT au côté serveur (Server Actions, API Routes).
// NE PAS l'importer dans des composants client.
import { initializeApp, getApps, App, cert, ServiceAccount } from 'firebase-admin/app';

// Cette fonction garantit que l'application admin est initialisée une seule fois (modèle singleton).
export async function initializeAdminApp(): Promise<App> {
  const apps = getApps();
  const adminApp = apps.find(app => app.name === 'firebase-admin-app');

  if (adminApp) {
    return adminApp;
  }

  // Tenter de lire les identifiants depuis les variables d'environnement.
  // C'est une méthode plus robuste pour Vercel, Netlify, etc.
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  let serviceAccount: ServiceAccount | undefined;

  if (serviceAccountKey) {
    try {
      serviceAccount = JSON.parse(serviceAccountKey);
    } catch (e) {
      console.error("Erreur lors de l'analyse de la clé de compte de service Firebase.", e);
    }
  }

  const credential = serviceAccount ? cert(serviceAccount) : undefined;

  // Si 'credential' est défini, on l'utilise. Sinon, on laisse le SDK
  // tenter de trouver les identifiants par défaut de l'environnement (pour Firebase Hosting).
  return initializeApp(
    credential ? { credential } : {},
    'firebase-admin-app'
  );
}
