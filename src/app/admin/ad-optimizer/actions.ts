"use server";

import { determineOptimalAdPlatform } from "@/ai/flows/platform-ad-integration";
import type { PlatformAdIntegrationInput, PlatformAdIntegrationOutput } from "@/ai/flows/platform-ad-integration";

type ActionResult = {
  data?: PlatformAdIntegrationOutput;
  error?: string;
};

export async function getAdPlatformRecommendation(
  input: PlatformAdIntegrationInput
): Promise<ActionResult> {
  try {
    const result = await determineOptimalAdPlatform(input);
    return { data: result };
  } catch (error) {
    console.error("Error in Genkit flow:", error);
    // Au lieu de lever une erreur, nous renvoyons un objet avec une propriété d'erreur.
    return { error: "Failed to get recommendation from AI." };
  }
}
