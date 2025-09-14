"use server";

import { z } from "zod";
import { getUserProfile, updateUserProfileInDB } from "@/lib/firebase-data";
import type { UserProfile } from "@/lib/types";

const profileSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
  }),
});

type UserProfileInput = z.infer<typeof profileSchema>;

type ActionResult = {
  data?: { message: string };
  error?: string;
};

export async function updateUserProfile(
  profileData: UserProfileInput
): Promise<ActionResult> {
  try {
    const existingProfile = await getUserProfile();
    if (!existingProfile || !existingProfile.id) {
      throw new Error("Profil utilisateur non trouvé ou ID manquant.");
    }

    // Combine existing data with new data
    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...profileData,
    };

    await updateUserProfileInDB(updatedProfile);
    
    console.log("Profil mis à jour avec succès avec les données :", updatedProfile);
    
    return { data: { message: "Profil mis à jour avec succès !" } };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    const errorMessage = error instanceof Error ? error.message : "Impossible de mettre à jour le profil.";
    return { error: errorMessage };
  }
}
