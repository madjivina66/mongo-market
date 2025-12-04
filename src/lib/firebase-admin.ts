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
      throw new Error("La clé de compte de service Firebase est mal formatée.");
    }
  } else {
      // En production, cette clé est requise.
      if (process.env.NODE_ENV === 'production') {
        throw new Error("La variable d'environnement FIREBASE_SERVICE_ACCOUNT_KEY est manquante.");
      }
      // En développement, on peut continuer sans, si l'émulateur ou les ADC sont configurés.
      console.warn("La variable d'environnement FIREBASE_SERVICE_ACCOUNT_KEY est manquante. Le SDK Admin tentera d'utiliser les identifiants par défaut de l'application (ADC).");
  }


  // Si 'credential' est défini, on l'utilise. Sinon, on laisse le SDK
  // tenter de trouver les identifiants par défaut de l'environnement (pour Firebase Hosting, Cloud Run...).
  return initializeApp(
    serviceAccount ? { credential: cert(serviceAccount) } : {},
    'firebase-admin-app'
  );
}
