// prompts/normalize.prompt.ts

/**
 * Normalize Prompt
 * Converts raw user input (e.g., WhatsApp message) into structured payload
 */
export function normalizePrompt(rawInput: string): string {
    return `
You are a parser for a garment shop's order system.

Convert this customer message into a structured JSON order.

RAW INPUT:
"${rawInput}"

EXPECTED OUTPUT FORMAT:
{
  "type": "alteration" | "order" | "stitching",
  "items": [
    {
      "sku": "string (guess based on description, e.g., SH-001 for shirt)",
      "qty": number,
      "size": "string (if mentioned)",
      "color": "string (if mentioned)",
      "fabric": "string (if mentioned)",
      "alteration_type": "string (e.g., sleeve_shortening, hem_adjustment)",
      "measurement": { "key_cm": number }
    }
  ],
  "required_skills": ["tailoring", "stitching", "embroidery", "delivery"],
  "estimated_minutes": number (your estimate),
  "preferred_slot": {
    "start": "ISO date string (if mentioned)",
    "end": "ISO date string"
  },
  "notes": "any additional details"
}

RULES:
- Extract as much information as possible
- Make reasonable assumptions for missing data
- Always include at least one item
- Estimate time based on complexity

Return ONLY the JSON, no explanation.
`;
}
