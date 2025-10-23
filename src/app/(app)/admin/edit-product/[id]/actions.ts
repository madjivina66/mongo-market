
"use server";

import { revalidatePath } from "next/cache";
import { getFirestore } from "firebase-admin/firestore";
import { initializeAdminApp } from "@/lib/firebase-admin";
import { getAuth } from "firebase-admin/auth";
import type { Product, ProductCategory } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";

// Le schéma de validation est mis à jour pour les nouvelles catégories
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

// Action serveur pour mettre à jour le produit
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

  const adminApp = await initializeAdminApp();
  const db = getFirestore(adminApp);
  const auth = getAuth(adminApp);

  let sellerId: string;

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    sellerId = decodedToken.uid;
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
    
    const updateData: Partial<Product> = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      category: data.category,
    };

    // Si une nouvelle image est fournie (même en démo), on la change. Sinon, on garde l'ancienne.
    if (data.image) {
        const placeholderImage = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];
        updateData.imageUrl = placeholderImage.imageUrl;
        updateData.imageHint = placeholderImage.imageHint;
    }

    await productRef.update(updateData);

    revalidatePath(`/products/${productId}`);
    revalidatePath("/admin/my-products");

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
