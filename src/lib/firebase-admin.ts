
// Ce fichier est destiné UNIQUEMENT au côté serveur (Server Actions, API Routes).
// NE PAS l'importer dans des composants client.
import { initializeApp, getApps, App } from 'firebase-admin/app';

// Cette fonction garantit que l'application admin est initialisée une seule fois (modèle singleton).
export async function initializeAdminApp(): Promise<App> {
  const apps = getApps();
  const adminApp = apps.find(app => app.name === 'firebase-admin-app');

  if (adminApp) {
    return adminApp;
  }

  // Dans un environnement géré comme Firebase App Hosting, le SDK Admin
  // peut être initialisé sans aucun argument. Il détectera automatiquement
  // les "Application Default Credentials" de l'environnement.
  return initializeApp({}, 'firebase-admin-app');
}
