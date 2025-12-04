"use server";

import { summarizeLiveChat } from "@/ai/flows/summarize-live-chat";
import type { LiveChatAnalysisInput, LiveChatAnalysisOutput } from "@/ai/flows/summarize-live-chat";

type ActionResult = {
  data?: LiveChatAnalysisOutput;
  error?: string;
};

export async function getLiveChatSummary(
  input: LiveChatAnalysisInput
): Promise<ActionResult> {
  try {
    const result = await summarizeLiveChat(input);
    return { data: result };
  } catch (error) {
    console.error("Error in Genkit flow:", error);
    return { error: "L'analyse du chat par l'IA a échoué." };
  }
}
