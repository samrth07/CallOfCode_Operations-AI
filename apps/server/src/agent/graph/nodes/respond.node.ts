// nodes/respond.node.ts
import type { OpsState, NormalizedPayload } from "../state";
import { respondPrompt } from "../../prompts/respond.prompt";
import { callGemini } from "../../services/gemini.service";

/**
 * Respond Node
 * Purpose: Generate customer-facing response
 * - Creates appropriate message based on decision
 * - Tone: polite, clear, confident
 */
export async function respondNode(state: OpsState): Promise<Partial<OpsState>> {
  console.log("[RESPOND] Generating response...");

  try {
    const context = {
      decision: state.decision,
      request: {
        id: state.request?.id,
        type: (state.request?.payload as unknown as NormalizedPayload)?.type,
        items: (state.request?.payload as unknown as NormalizedPayload)?.items,
      },
      customer: state.customer ? {
        name: state.customer.name,
      } : null,
      tasksCreated: state.plannedTasks?.length ?? 0,
      error: state.error,
    };

    const prompt = respondPrompt(context);
    const response = await callGemini(prompt);

    console.log("[RESPOND] Response generated");
    return { response: response.trim() };

  } catch (error) {
    console.error("[RESPOND] Error:", error);
    // Fallback response
    const fallbackResponses: Record<string, string> = {
      ACCEPT_AND_PLAN: "Your request has been received and is being processed. We will update you shortly.",
      DELAY_REQUEST: "We're currently experiencing high demand. Your request has been queued and will be processed soon.",
      ESCALATE_TO_OWNER: "Your request requires special attention. Our team will contact you shortly.",
    };

    const response = state.decision?.action
      ? fallbackResponses[state.decision.action]
      : "Thank you for your request. We'll be in touch soon.";

    return { response };
  }
}
