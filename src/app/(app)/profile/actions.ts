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

    const profileToSave: UserProfile = {
      ...profileData,
      // If an existing profile is found, use its ID. Otherwise, use a default ID to create a new one.
      // In a real app, this would come from the authenticated user's ID.
      id: existingProfile ? existingProfile.id : "default-user-profile",
    };

    await updateUserProfileInDB(profileToSave);
    
    console.log("Profil sauvegardé avec succès avec les données :", profileToSave);
    
    return { data: { message: "Profil sauvegardé avec succès !" } };
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du profil:", error);
    const errorMessage = error instanceof Error ? error.message : "Impossible de sauvegarder le profil.";
    return { error: errorMessage };
  }
}
