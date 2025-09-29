
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getFirestore } from "firebase-admin/firestore";
import { initializeAdminApp } from "@/lib/firebase-admin";
import { headers } from "next/headers";
import { getAuth } from "firebase-admin/auth";

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
  const auth = getAuth(adminApp);

  // Obtenir l'ID de l'utilisateur à partir du token d'authentification
  const authorization = headers().get("Authorization");
  let sellerId: string;

  if (authorization?.startsWith("Bearer ")) {
    const idToken = authorization.split("Bearer ")[1];
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      sellerId = decodedToken.uid;
    } catch (error) {
      console.error("Erreur de vérification du token:", error);
      return { error: "Authentification invalide. Impossible d'ajouter le produit." };
    }
  } else {
    return { error: "Non autorisé. Token d'authentification manquant." };
  }
  
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
      sellerId, // Lier le produit au vendeur connecté
      createdAt: new Date(),
    });
    
    // Invalider le cache pour la page des produits afin que la liste soit mise à jour
    revalidatePath("/products");
    revalidatePath("/admin/my-products"); // Invalider aussi la future page "Mes produits"

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
