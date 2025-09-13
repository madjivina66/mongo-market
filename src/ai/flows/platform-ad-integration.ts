'use server';

/**
 * @fileOverview Ce fichier définit un flux Genkit pour déterminer la plateforme publicitaire optimale (WhatsApp, Instagram ou Facebook)
 * en fonction des préférences des clients et des données de vente. Cela aide les administrateurs de plateforme à maximiser l'efficacité de la publicité.
 *
 * - `determineOptimalAdPlatform` - Une fonction qui prend les préférences des clients et les données de vente en entrée
 *   et renvoie la plateforme publicitaire recommandée.
 * - `PlatformAdIntegrationInput` - Le type d'entrée pour la fonction `determineOptimalAdPlatform`.
 * - `PlatformAdIntegrationOutput` - Le type de sortie pour la fonction `determineOptimalAdPlatform`.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PlatformAdIntegrationInputSchema = z.object({
  customerPreferences: z
    .string()
    .describe('Une description des préférences des clients, par exemple, âge, lieu, centres d\'intérêt'),
  salesData: z.string().describe('Données sur les performances de ventes passées.'),
});
export type PlatformAdIntegrationInput = z.infer<
  typeof PlatformAdIntegrationInputSchema
>;

const PlatformAdIntegrationOutputSchema = z.object({
  recommendedPlatform: z
    .enum(['WhatsApp', 'Instagram', 'Facebook'])
    .describe('La plateforme publicitaire recommandée.'),
  reasoning: z
    .string()
    .describe(
      'Le raisonnement de l\'IA derrière la recommandation de la plateforme, basé sur les préférences des clients et les données de vente.'
    ),
});
export type PlatformAdIntegrationOutput = z.infer<
  typeof PlatformAdIntegrationOutputSchema
>;

export async function determineOptimalAdPlatform(
  input: PlatformAdIntegrationInput
): Promise<PlatformAdIntegrationOutput> {
  return determineOptimalAdPlatformFlow(input);
}

const platformAdIntegrationPrompt = ai.definePrompt({
  name: 'platformAdIntegrationPrompt',
  input: {schema: PlatformAdIntegrationInputSchema},
  output: {schema: PlatformAdIntegrationOutputSchema},
  prompt: `En vous basant sur les préférences clients suivantes : {{{customerPreferences}}} et les données de ventes : {{{salesData}}}, déterminez la plateforme publicitaire optimale (WhatsApp, Instagram, ou Facebook) pour une campagne publicitaire ciblée. Expliquez votre raisonnement.

  La recommandation DOIT être l'une des suivantes : WhatsApp, Instagram, ou Facebook.

  Sortie :
  Plateforme Recommandée : {{recommendedPlatform}}
  Raisonnement : {{reasoning}}`,
});

const determineOptimalAdPlatformFlow = ai.defineFlow(
  {
    name: 'determineOptimalAdPlatformFlow',
    inputSchema: PlatformAdIntegrationInputSchema,
    outputSchema: PlatformAdIntegrationOutputSchema,
  },
  async input => {
    const {output} = await platformAdIntegrationPrompt(input);
    return output!;
  }
);
