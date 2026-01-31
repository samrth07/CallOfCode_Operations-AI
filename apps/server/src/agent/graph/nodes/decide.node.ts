// nodes/decide.node.ts
import type { OpsState, AgentDecision, NormalizedPayload } from "../state";
import { decidePrompt } from "../../prompts/decide.prompt";
import { callGemini, extractJSON } from "../../services/gemini.service";

/**
 * Decide Node (Supervisor Decision Agent)
 * Purpose: Decide the next best action
 * - Reasons about priorities, constraints, and trade-offs
 * - Chooses a concrete next action
 * 
 * Hard requirement: The system must decide — not list options.
 * Decisions must be: Contextual, Reversible, Explainable
 */
export async function decideNode(state: OpsState): Promise<Partial<OpsState>> {
  console.log("[DECIDE] Making decision...");

  // If there's an error, escalate to owner
  if (state.error) {
    console.log("[DECIDE] Error detected, escalating to owner");
    return {
      decision: {
        action: "ESCALATE_TO_OWNER",
        reason: `System error occurred: ${state.error}`,
        escalationPriority: "high",
      },
    };
  }

  try {
    // Build context for the LLM
    const context = {
      request: {
        id: state.request?.id,
        status: state.request?.status,
        priority: state.request?.priority,
        dueBy: state.request?.dueBy,
        payload: state.request?.payload as NormalizedPayload,
      },
      customer: state.customer ? {
        name: state.customer.name,
        phone: state.customer.phone,
      } : null,
      inventoryCheck: state.inventoryCheck,
      staffLoad: state.staffLoad.map(s => ({
        name: s.name,
        skills: s.skills,
        activeTasks: s.activeTasks,
        estimatedMinutesRemaining: s.estimatedMinutesRemaining,
      })),
      activeTasksCount: state.activeTasks.length,
    };

    const prompt = decidePrompt(context);
    const raw = await callGemini(prompt);

    // Extract and parse JSON response
    const jsonStr = extractJSON(raw);
    const decision = JSON.parse(jsonStr) as AgentDecision;

    // Validate decision
    const validActions = ["ACCEPT_AND_PLAN", "DELAY_REQUEST", "ESCALATE_TO_OWNER"];
    if (!validActions.includes(decision.action)) {
      console.warn(`[DECIDE] Invalid action: ${decision.action}, defaulting to ESCALATE_TO_OWNER`);
      return {
        decision: {
          action: "ESCALATE_TO_OWNER",
          reason: `Invalid decision action received: ${decision.action}`,
          escalationPriority: "medium",
        },
      };
    }

    console.log(`[DECIDE] Decision: ${decision.action} - ${decision.reason}`);
    return { decision };

  } catch (error) {
    console.error("[DECIDE] Error:", error);
    // Fallback decision - escalate to owner
    return {
      decision: {
        action: "ESCALATE_TO_OWNER",
        reason: `Decision error: ${error instanceof Error ? error.message : String(error)}`,
        escalationPriority: "high",
      },
    };
  }
}
