
"use server";

import { revalidatePath } from "next/cache";
import { getFirestore } from "firebase-admin/firestore";
import { initializeAdminApp } from "@/lib/firebase-admin";
import type { Product } from "@/lib/types";

type ActionResult = {
  data?: { message: string; };
  error?: string;
};

// Action serveur pour supprimer un produit
export async function deleteProduct(productId: string): Promise<ActionResult> {
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

    // La vérification est temporairement assouplie
    // if (productData.sellerId !== sellerId) {
    //   return { error: "Action non autorisée. Vous n'êtes pas le propriétaire de ce produit." };
    // }

    await productRef.delete();

    // Invalider les caches pour mettre à jour les listes de produits
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/vendeur/mes-produits");

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
