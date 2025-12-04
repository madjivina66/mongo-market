'use server';

/**
 * @fileOverview Ce fichier définit un flux Genkit pour analyser une transcription de chat en direct
 * et fournir un résumé, une analyse des sentiments, les questions clés, et des suggestions de produits.
 *
 * - `summarizeLiveChat` - Une fonction qui prend une transcription de chat et renvoie une analyse.
 * - `LiveChatAnalysisInput` - Le type d'entrée pour la fonction.
 * - `LiveChatAnalysisOutput` - Le type de sortie pour la fonction.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LiveChatAnalysisInputSchema = z.object({
  chatTranscription: z
    .string()
    .describe('La transcription complète du chat en direct, avec chaque message sur une nouvelle ligne.'),
});
export type LiveChatAnalysisInput = z.infer<
  typeof LiveChatAnalysisInputSchema
>;

const LiveChatAnalysisOutputSchema = z.object({
  sentiment: z
    .enum(['Positif', 'Neutre', 'Négatif'])
    .describe('Le sentiment général des spectateurs dans le chat.'),
  keyQuestions: z
    .array(z.string())
    .describe('Une liste des questions les plus fréquemment posées par les spectateurs.'),
  popularKeywords: z
    .array(z.string())
    .describe('Les mots-clés ou sujets les plus populaires mentionnés dans le chat.'),
  productSuggestion: z
    .string()
    .describe("Une suggestion sur quel type de produit présenter ensuite, basée sur la discussion. Si aucune suggestion, renvoyer 'Aucune'.")
});
export type LiveChatAnalysisOutput = z.infer<
  typeof LiveChatAnalysisOutputSchema
>;

export async function summarizeLiveChat(
  input: LiveChatAnalysisInput
): Promise<LiveChatAnalysisOutput> {
  return summarizeLiveChatFlow(input);
}

const liveChatPrompt = ai.definePrompt({
  name: 'liveChatPrompt',
  input: {schema: LiveChatAnalysisInputSchema},
  output: {schema: LiveChatAnalysisOutputSchema},
  prompt: `Vous êtes un assistant de vente expert pour une session de shopping en direct. Analysez la transcription du chat suivante :

  {{{chatTranscription}}}

  Votre tâche est de fournir un résumé concis pour le vendeur.
  1. Déterminez le sentiment général des spectateurs.
  2. Extrayez les questions les plus importantes et récurrentes.
  3. Identifiez les mots-clés ou les sujets les plus discutés.
  4. Suggérez un type de produit à présenter ensuite en vous basant sur les discussions.

  Fournissez une sortie structurée.`,
});

const summarizeLiveChatFlow = ai.defineFlow(
  {
    name: 'summarizeLiveChatFlow',
    inputSchema: LiveChatAnalysisInputSchema,
    outputSchema: LiveChatAnalysisOutputSchema,
  },
  async input => {
    if (!input.chatTranscription.trim()) {
        return {
            sentiment: 'Neutre',
            keyQuestions: [],
            popularKeywords: ["Pas assez de messages pour analyser."],
            productSuggestion: 'Aucune'
        }
    }
    const {output} = await liveChatPrompt(input);
    return output!;
  }
);
