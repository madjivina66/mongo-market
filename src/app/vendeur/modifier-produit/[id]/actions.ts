
"use server";

import { revalidatePath } from "next/cache";
import { getFirestore } from "firebase-admin/firestore";
import { initializeAdminApp } from "@/lib/firebase-admin";
import type { Product, ProductCategory } from "@/lib/types";

// Le champ 'image' est optionnel car on ne le transmet pas
export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image?: any;
};

type ActionResult = {
  data?: { message: string; };
  error?: string;
};

// L'action n'accepte plus le token pour le moment
export async function updateProduct(
  productId: string,
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

  const adminApp = await initializeAdminApp();
  const db = getFirestore(adminApp);
  const sellerId = "seller_test_id_12345"; // ID statique

  try {
    const productRef = db.collection("products").doc(productId);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return { error: "Le produit n'existe pas." };
    }
    
    const productData = productDoc.data() as Product;

    // La vérification de propriété est temporairement assouplie
    // if (productData.sellerId !== sellerId) {
    //   return { error: "Action non autorisée. Vous n'êtes pas le propriétaire de ce produit." };
    // }
    
    const updateData: Partial<Omit<Product, 'id'>> = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      category: data.category,
    };

    await productRef.update(updateData);

    revalidatePath("/");
    revalidatePath(`/products/${productId}`);
    revalidatePath("/vendeur/mes-produits");

    return { 
      data: {
        message: "Produit mis à jour avec succès !"
      }
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error);
    const errorMessage = error instanceof Error ? error.message : "Impossible de mettre à jour le produit.";
    return { error: errorMessage };
  }
}
