'use server';

/**
 * @fileOverview This file defines a Genkit flow for determining the optimal advertising platform (WhatsApp, Instagram, or Facebook)
 *  based on customer preferences and sales data. This helps platform admins maximize advertising effectiveness.
 *
 * - `determineOptimalAdPlatform` -  A function that takes customer preferences and sales data as input
 *    and returns the recommended advertising platform.
 * - `PlatformAdIntegrationInput` - The input type for the `determineOptimalAdPlatform` function.
 * - `PlatformAdIntegrationOutput` - The output type for the `determineOptimalAdPlatform` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PlatformAdIntegrationInputSchema = z.object({
  customerPreferences: z
    .string()
    .describe('A description of customer preferences e.g. age, location, interests'),
  salesData: z.string().describe('Data on past sales performance.'),
});
export type PlatformAdIntegrationInput = z.infer<
  typeof PlatformAdIntegrationInputSchema
>;

const PlatformAdIntegrationOutputSchema = z.object({
  recommendedPlatform: z
    .enum(['WhatsApp', 'Instagram', 'Facebook'])
    .describe('The recommended advertising platform.'),
  reasoning: z
    .string()
    .describe(
      'The AI reasoning behind the platform recommendation, based on customer preferences and sales data.'
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
  prompt: `Based on the following customer preferences: {{{customerPreferences}}} and sales data: {{{salesData}}}, determine the optimal advertising platform (WhatsApp, Instagram, or Facebook) for a targeted advertising campaign. Explain your reasoning.

  The recommendation MUST be one of WhatsApp, Instagram, or Facebook.

  Output:
  Recommended Platform: {{recommendedPlatform}}
  Reasoning: {{reasoning}}`,
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
