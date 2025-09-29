
"use server";

import { revalidatePath } from "next/cache";
import { getFirestore } from "firebase-admin/firestore";
import { initializeAdminApp } from "@/lib/firebase-admin";
import { headers } from "next/headers";
import { getAuth } from "firebase-admin/auth";
import type { WithId, Product } from "@/lib/types";

type ActionResult = {
  data?: { message: string; };
  error?: string;
};

// Action serveur pour supprimer un produit
export async function deleteProduct(productId: string): Promise<ActionResult> {
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
      return { error: "Authentification invalide. Impossible de supprimer le produit." };
    }
  } else {
    return { error: "Non autorisé. Token d'authentification manquant." };
  }

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

    await productRef.delete();

    // Invalider les caches pour mettre à jour les listes de produits
    revalidatePath("/products");
    revalidatePath("/admin/my-products");

    return {
      data: {
        message: "Produit supprimé avec succès !",
      }
    };
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error);
    const errorMessage = error instanceof Error ? error.message : "Impossible de supprimer le produit.";
    return { error: errorMessage };
  }
}
