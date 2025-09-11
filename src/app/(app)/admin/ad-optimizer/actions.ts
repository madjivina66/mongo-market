"use server";

import { determineOptimalAdPlatform } from "@/ai/flows/platform-ad-integration";
import type { PlatformAdIntegrationInput, PlatformAdIntegrationOutput } from "@/ai/flows/platform-ad-integration";

export async function getAdPlatformRecommendation(
  input: PlatformAdIntegrationInput
): Promise<PlatformAdIntegrationOutput> {
  try {
    const result = await determineOptimalAdPlatform(input);
    return result;
  } catch (error) {
    console.error("Error in Genkit flow:", error);
    throw new Error("Failed to get recommendation from AI.");
  }
}
