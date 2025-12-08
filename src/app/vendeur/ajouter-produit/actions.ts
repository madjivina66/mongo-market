
"use server";

import { revalidatePath } from "next/cache";
import { getFirestore } from "firebase-admin/firestore";
import { initializeAdminApp } from "@/lib/firebase-admin";
import type { ProductCategory } from "@/lib/types";

// Ce type définit la structure des données du formulaire
// Le champ 'image' est optionnel car on ne le transmet pas
export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl: string;
  imageHint: string;
  image?: any;
};

type ActionResult = {
  data?: { message: string; productId: string; };
  error?: string;
};

// L'action n'accepte plus le token pour le moment pour contourner le bug
export async function addProduct(
  data: Omit<ProductFormData, 'image'>
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
  if (!data.imageUrl || !data.imageHint) {
    return { error: "L'image du produit est requise." };
  }

  // Initialiser l'app admin Firebase pour accéder à Firestore côté serveur
  const adminApp = await initializeAdminApp();
  const db = getFirestore(adminApp);
  
  // Utilisation d'un ID de vendeur statique pour le test
  const sellerId = "seller_test_id_12345";

  try {
    const docRef = await db.collection("products").add({
      name: data.name,
      description: data.description,
      price: Number(data.price),
      category: data.category,
      imageUrl: data.imageUrl,
      imageHint: data.imageHint,
      sellerId, // Utilisation de l'ID statique
      createdAt: new Date(), // CORRECTION : Ajout du champ createdAt
    });
    
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/vendeur/mes-produits");

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
