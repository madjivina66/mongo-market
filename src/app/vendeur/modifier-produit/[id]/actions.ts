
"use server";

import { revalidatePath } from "next/cache";
import { getFirestore } from "firebase-admin/firestore";
import { initializeAdminApp } from "@/lib/firebase-admin";
import { getAuth } from "firebase-admin/auth";
import type { Product, ProductCategory } from "@/lib/types";

// Le champ 'image' est optionnel car on ne le transmet pas
export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl: string;
};

type ActionResult = {
  data?: { message: string; };
  error?: string;
};

// L'action accepte maintenant le token comme argument
export async function updateProduct(
  productId: string,
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
  if (!data.imageUrl) {
    return { error: "L'URL de l'image est requise." };
  }

  const adminApp = await initializeAdminApp();
  const db = getFirestore(adminApp);
  const auth = getAuth(adminApp);

  let sellerId: string;

  try {
     if (!idToken) {
      return { error: "Authentification invalide." };
    }
    const decodedToken = await auth.verifyIdToken(idToken);
    sellerId = decodedToken.uid;
     if (!sellerId) {
        throw new Error("ID utilisateur non trouvé dans le token.");
    }
  } catch (error) {
    console.error("Erreur de vérification du token:", error);
    return { error: "Authentification invalide." };
  }

  try {
    const productRef = db.collection("products").doc(productId);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return { error: "Le produit n'existe pas." };
    }
    
    const productData = productDoc.data() as Product;

    if (productData.sellerId !== sellerId) {
      return { error: "Action non autorisée. Vous n'êtes pas le propriétaire de ce produit." };
    }
    
    const updateData: Partial<Omit<Product, 'id'>> = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      category: data.category,
      imageUrl: data.imageUrl,
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
