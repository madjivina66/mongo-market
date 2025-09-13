'use server';
import { db } from './firebase-config';
import { collection, getDocs, doc, getDoc, limit, query } from 'firebase/firestore';
import type { Product, Order, UserProfile } from './types';

export async function getProducts(): Promise<Product[]> {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return productList;
}

export async function getProductById(id: string): Promise<Product | null> {
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);
    if (!productSnap.exists()) {
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
    const ordersCol = collection(db, 'orders');
    const orderSnapshot = await getDocs(ordersCol);
    const orderList = orderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    return orderList;
}

export async function getUserProfile(): Promise<UserProfile | null> {
    // For this example, we'll fetch the first profile available.
    // In a real app, you'd get the current user's ID from an auth session.
    await db.settings; // Ensures Firestore is ready
    const profileCollection = collection(db, 'userProfiles');
    const q = query(profileCollection, limit(1));
    const profileSnapshot = await getDocs(q);
    
    if (profileSnapshot.empty) {
        console.warn("No user profiles found in the 'userProfiles' collection.");
        return null;
    }

    const profileDoc = profileSnapshot.docs[0];
    return profileDoc.data() as UserProfile;
}
