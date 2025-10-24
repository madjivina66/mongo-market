
"use server";

import { revalidatePath } from "next/cache";
import { getFirestore } from "firebase-admin/firestore";
import { initializeAdminApp } from "@/lib/firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { ProductCategory } from "@/lib/types";

// Ce type définit la structure des données du formulaire
export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image?: any;
};

type ActionResult = {
  data?: { message: string; productId: string; };
  error?: string;
};

// L'action accepte maintenant le token comme argument
export async function addProduct(
  data: ProductFormData,
  idToken: string
): Promise<ActionResult> {

  // Validation manuelle des données côté serveur
  if (!data.name || data.name.length < 3) {
    return { error: "Le nom doit contenir au moins 3 caractères." };
  }
  if (!data.description || data.description.length < 3) {
    return { error: "La description doit être plus détaillée." };
  }
  if (!data.price || data.price <= 0) {
    return { error: "Le prix doit être un nombre positif." };
  }
  if (!data.category) {
    return { error: "La catégorie est requise." };
  }

  // Initialiser l'app admin Firebase pour accéder à Firestore côté serveur
  const adminApp = await initializeAdminApp();
  const db = getFirestore(adminApp);
  const auth = getAuth(adminApp);

  let sellerId: string;

  try {
     if (!idToken) {
      return { error: "Authentification invalide. Jeton manquant." };
    }
    const decodedToken = await auth.verifyIdToken(idToken);
    sellerId = decodedToken.uid;
  } catch (error) {
    console.error("Erreur de vérification du token:", error);
    return { error: "Authentification invalide. Impossible de vérifier l'utilisateur." };
  }
  
  const placeholderImage = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];
  const imageUrl = placeholderImage.imageUrl;
  const imageHint = placeholderImage.imageHint;

  try {
    const docRef = await db.collection("products").add({
      name: data.name,
      description: data.description,
      price: Number(data.price),
      category: data.category,
      imageUrl,
      imageHint,
      sellerId,
      createdAt: new Date(),
    });
    
    revalidatePath("/products");
    revalidatePath("/admin/my-products");

    return { 
        data: {
            message: "Produit ajouté avec succès !",
            productId: docRef.id
        } 
    };
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit:", error);
    const errorMessage = error instanceof Error ? error.message : "Impossible d'ajouter le produit.";
    return { error: errorMessage };
  }
}
