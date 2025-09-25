
import admin from 'firebase-admin';
import { firebaseConfig } from '@/firebase/config';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`
  });
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
