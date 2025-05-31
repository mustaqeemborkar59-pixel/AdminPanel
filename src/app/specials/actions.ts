
"use server";

import { suggestDailySpecial, type SuggestDailySpecialInput, type SuggestDailySpecialOutput } from "@/ai/flows/suggest-daily-special";

export async function getSpecialSuggestions(input: SuggestDailySpecialInput): Promise<SuggestDailySpecialOutput | { error: string }> {
  try {
    // Basic validation (more robust validation could be added with Zod on the server action too)
    if (!input.availableIngredients || input.availableIngredients.length === 0) {
      return { error: "Please provide available ingredients." };
    }
    if (!input.currentInventory || Object.keys(input.currentInventory).length === 0) {
      // Allow empty inventory, but AI might not give great results
      console.warn("Current inventory is empty for special suggestions.");
    }

    const result = await suggestDailySpecial(input);
    return result;
  } catch (e) {
    console.error("Error calling suggestDailySpecial flow:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred while generating suggestions.";
    return { error: `Failed to get suggestions: ${errorMessage}` };
  }
}
