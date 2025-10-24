
"use server";

import { revalidatePath } from "next/cache";
import { getFirestore } from "firebase-admin/firestore";
import { initializeAdminApp } from "@/lib/firebase-admin";
import { getAuth } from "firebase-admin/auth";

type ActionResult = {
  data?: { message: string; };
  error?: string;
};

// Action pour mettre à jour le statut de l'utilisateur vers "Pro"
export async function upgradeToPro(idToken: string): Promise<ActionResult> {
  const adminApp = await initializeAdminApp();
  const db = getFirestore(adminApp);
  const auth = getAuth(adminApp);

  let userId: string;

  try {
    if (!idToken) {
      return { error: "Authentification invalide." };
    }
    const decodedToken = await auth.verifyIdToken(idToken);
    userId = decodedToken.uid;
  } catch (error) {
    console.error("Erreur de vérification du token:", error);
    return { error: "Authentification invalide." };
  }

  try {
    const userProfileRef = db.collection("userProfiles").doc(userId);
    
    // Met à jour le document de l'utilisateur pour inclure le statut Pro.
    // L'option { merge: true } est cruciale pour ne pas écraser les autres champs du profil.
    await userProfileRef.set({ isPro: true }, { merge: true });

    // Invalider les caches pour s'assurer que les nouvelles données sont récupérées
    revalidatePath("/subscription");
    revalidatePath("/app"); // Invalide le layout principal pour rafraîchir la navigation

    return { 
      data: {
        message: "Compte mis à jour vers Pro avec succès !"
      }
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour vers Pro:", error);
    const errorMessage = error instanceof Error ? error.message : "Impossible de mettre à jour le compte.";
    return { error: errorMessage };
  }
}
