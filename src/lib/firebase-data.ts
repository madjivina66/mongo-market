'use server';
import { db } from './firebase-config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
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
    // For this example, we'll fetch a single hardcoded profile document.
    // In a real app, you'd get the current user's ID from an auth session.
    const profileRef = doc(db, 'userProfiles', 'jean-dupont');
    const profileSnap = await getDoc(profileRef);
    if (!profileSnap.exists()) {
        return null;
    }
    return profileSnap.data() as UserProfile;
}
