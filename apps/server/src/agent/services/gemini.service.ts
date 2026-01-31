// services/gemini.service.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

/**
 * Call Gemini API with a prompt
 */
export async function callGemini(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text;
  } catch (error) {
    console.error("[GEMINI] API Error:", error);
    throw new Error(`Gemini API error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Extract JSON from a potentially mixed response
 * Handles cases where the model adds explanation text around JSON
 */
export function extractJSON(text: string): string {
  // Try to find JSON in the response
  const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (jsonMatch) {
    return jsonMatch[0];
  }

  // If no JSON found, return the trimmed text (might be valid JSON already)
  return text.trim();
}

/**
 * Call Gemini and parse response as JSON
 */
export async function callGeminiJSON<T>(prompt: string): Promise<T> {
  const raw = await callGemini(prompt);
  const jsonStr = extractJSON(raw);
  return JSON.parse(jsonStr) as T;
}
