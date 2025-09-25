
'use server';

import { adminDb } from '@/lib/firebase-admin';
import type { Product, Order, UserProfile } from './types';

// Note: We are now using the Firebase Admin SDK for server-side data fetching.
// The functions from 'firebase/firestore' (client-side) are replaced with
// direct interactions with the adminDb instance.

export async function getProducts(): Promise<Product[]> {
    const productsCol = adminDb.collection('products');
    const productSnapshot = await productsCol.get();
    if (productSnapshot.empty) {
        return [];
    }
    const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return productList;
}

export async function getProductById(id: string): Promise<Product | null> {
    const productRef = adminDb.collection('products').doc(id);
    const productSnap = await productRef.get();
    if (!productSnap.exists) {
        return null;
    }
    return { id: productSnap.id, ...productSnap.data() } as Product;
}

export async function getCategories(): Promise<string[]> {
    const products = await getProducts();
    const categories = ['Tout', ...new Set(products.map(p => p.category))];
    return categories;
}

export async function getOrders(): Promise<Order[]> {
    const ordersCol = adminDb.collection('orders');
    const orderSnapshot = await ordersCol.get();
     if (orderSnapshot.empty) {
        return [];
    }
    const orderList = orderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    return orderList;
}

export async function getUserProfile(): Promise<UserProfile | null> {
    // For this example, we'll fetch the first profile available.
    // In a real app, you'd get the current user's ID from an auth session.
    const profileCollection = adminDb.collection('userProfiles');
    const profileSnapshot = await profileCollection.limit(1).get();
    
    if (profileSnapshot.empty) {
        console.warn("No user profiles found in the 'userProfiles' collection.");
        return null;
    }

    const profileDoc = profileSnapshot.docs[0];
    return { id: profileDoc.id, ...profileDoc.data() } as UserProfile;
}

export async function updateUserProfileInDB(profile: UserProfile): Promise<void> {
    if (!profile.id) {
        throw new Error("Profile ID is missing. Cannot update.");
    }
    const profileRef = adminDb.collection('userProfiles').doc(profile.id);
    // Use setDoc with merge: true to update or create if it doesn't exist.
    await profileRef.set(profile, { merge: true });
}
