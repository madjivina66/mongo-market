
'use client';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  limit,
  type Firestore,
} from 'firebase/firestore';
import type { Product, UserProfile } from './types';

// IMPORTANT: Ces fonctions fonctionnent maintenant côté client.
// Pour les utiliser dans un composant, assurez-vous qu'il s'agit d'un composant client ('use client').

export async function getProducts(db: Firestore): Promise<Product[]> {
  const productsCol = collection(db, 'products');
  const productSnapshot = await getDocs(productsCol);
  if (productSnapshot.empty) {
    return [];
  }
  const productList = productSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
  return productList;
}

export async function getProductById(
  db: Firestore,
  id: string
): Promise<Product | null> {
  const productRef = doc(db, 'products', id);
  const productSnap = await getDoc(productRef);
  if (!productSnap.exists()) {
    return null;
  }
  return { id: productSnap.id, ...productSnap.data() } as Product;
}

export async function getCategories(db: Firestore): Promise<string[]> {
    const products = await getProducts(db);
    if (products.length === 0) {
        return ['Tout'];
    }
    const categories = ['Tout', ...new Set(products.map(p => p.category))];
    return categories;
}

export async function getUserProfile(db: Firestore): Promise<UserProfile | null> {
  // Pour cet exemple, nous allons chercher le premier profil disponible.
  // Dans une vraie application, vous obtiendriez l'ID de l'utilisateur actuel à partir d'une session d'authentification.
  const profileCollection = collection(db, 'userProfiles');
  // NOTE: Dans une vraie app, on filtrerait par l'ID de l'utilisateur connecté
  const q = query(profileCollection, limit(1));
  const profileSnapshot = await getDocs(q);

  if (profileSnapshot.empty) {
    console.warn("Aucun profil utilisateur trouvé dans la collection 'userProfiles'.");
    return null;
  }

  const profileDoc = profileSnapshot.docs[0];
  return { id: profileDoc.id, ...profileDoc.data() } as UserProfile;
}

export async function updateUserProfileInDB(db: Firestore, profile: UserProfile): Promise<void> {
  if (!profile.id) {
    throw new Error("L'ID du profil est manquant. Impossible de mettre à jour.");
  }
  const profileRef = doc(db, 'userProfiles', profile.id);
  // Utiliser set avec merge: true pour mettre à jour ou créer s'il n'existe pas.
  await setDoc(profileRef, profile, { merge: true });
}
