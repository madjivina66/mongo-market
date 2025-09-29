
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getFirestore } from "firebase-admin/firestore";
import { initializeAdminApp } from "@/lib/firebase-admin";

// Schéma de validation pour le formulaire de produit
export const productSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères."),
  description: z.string().min(10, "La description doit être plus détaillée."),
  price: z.coerce.number().positive("Le prix doit être un nombre positif."),
  category: z.enum(['Légumes', 'Fruits', 'Viande', 'Produits laitiers', 'Épices']),
  image: z.string().min(1, "Veuillez sélectionner une image."),
});

export type ProductFormData = z.infer<typeof productSchema>;

type ActionResult = {
  data?: { message: string; productId: string; };
  error?: string;
};

// Action serveur pour ajouter le produit à Firestore
export async function addProduct(
  data: ProductFormData
): Promise<ActionResult> {

  // Initialiser l'app admin Firebase pour accéder à Firestore côté serveur
  const adminApp = await initializeAdminApp();
  const db = getFirestore(adminApp);
  
  // Extraire l'URL et l'indice de l'image
  const [imageUrl, imageHint] = data.image.split('|');

  try {
    const docRef = await db.collection("products").add({
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      imageUrl,
      imageHint,
    });
    
    // Invalider le cache pour la page des produits afin que la liste soit mise à jour
    revalidatePath("/products");

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
