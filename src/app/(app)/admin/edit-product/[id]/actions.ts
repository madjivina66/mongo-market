
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getFirestore } from "firebase-admin/firestore";
import { initializeAdminApp } from "@/lib/firebase-admin";
import { headers } from "next/headers";
import { getAuth } from "firebase-admin/auth";
import type { Product } from "@/lib/types";

// Le schéma de validation est le même que pour l'ajout
export const productSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères."),
  description: z.string().min(10, "La description doit être plus détaillée."),
  price: z.coerce.number().positive("Le prix doit être un nombre positif."),
  category: z.enum(['Légumes', 'Fruits', 'Viande', 'Produits laitiers', 'Épices']),
  image: z.string().min(1, "Veuillez sélectionner une image."),
});

export type ProductFormData = z.infer<typeof productSchema>;

type ActionResult = {
  data?: { message: string; };
  error?: string;
};

// Action serveur pour mettre à jour le produit
export async function updateProduct(
  productId: string,
  data: ProductFormData
): Promise<ActionResult> {
  const adminApp = await initializeAdminApp();
  const db = getFirestore(adminApp);
  const auth = getAuth(adminApp);

  const authorization = headers().get("Authorization");
  let sellerId: string;

  if (authorization?.startsWith("Bearer ")) {
    const idToken = authorization.split("Bearer ")[1];
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      sellerId = decodedToken.uid;
    } catch (error) {
      console.error("Erreur de vérification du token:", error);
      return { error: "Authentification invalide." };
    }
  } else {
    return { error: "Non autorisé." };
  }

  const [imageUrl, imageHint] = data.image.split('|');

  try {
    const productRef = db.collection("products").doc(productId);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return { error: "Le produit n'existe pas." };
    }
    
    const productData = productDoc.data() as Product;

    // Vérification de sécurité cruciale : l'utilisateur est-il le propriétaire ?
    if (productData.sellerId !== sellerId) {
      return { error: "Action non autorisée. Vous n'êtes pas le propriétaire de ce produit." };
    }

    // Mise à jour du document
    await productRef.update({
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      imageUrl,
      imageHint,
    });

    // Invalider les caches pour rafraîchir les données
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
