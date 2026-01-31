// prompts/respond.prompt.ts

/**
 * Response Prompt
 * Generates customer-facing messages
 */
export function respondPrompt(context: any): string {
  return `
You are writing a response for a garment shop customer.

CONTEXT:
${JSON.stringify(context, null, 2)}

Write a short, professional message based on the decision:

For ACCEPT_AND_PLAN:
- Confirm receipt of order
- Mention tasks will be processed
- Give estimated timeline if possible
- Thank the customer

For DELAY_REQUEST:
- Apologize politely for delay
- Explain briefly (without excuses)
- Give expected timeline
- Reassure them

For ESCALATE_TO_OWNER:
- Acknowledge the request
- Mention it needs special attention
- Promise follow-up

RULES:
- Keep it under 100 words
- Be polite, clear, and confident
- Don't mention internal processes
- Address customer by name if available
- Don't use placeholder text like [date]

Return ONLY the message text, no JSON wrapper.
`;
}
