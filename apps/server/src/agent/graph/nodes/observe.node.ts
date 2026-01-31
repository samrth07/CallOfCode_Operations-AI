// nodes/observe.node.ts
import prisma from "@Hackron/db";
import type { OpsState, NormalizedPayload } from "../state";
import { callGemini } from "../../services/gemini.service";
import { normalizePrompt } from "../../prompts/normalize.prompt";

/**
 * Observe Node
 * Purpose: Detect change and load request data
 * - Loads the request from database
 * - Normalizes raw input (WhatsApp messages) if needed
 * 
 * Rule: Observation must be dumb, fast, and reliable.
 */
export async function observeNode(state: OpsState): Promise<Partial<OpsState>> {
  console.log(`[OBSERVE] Processing request: ${state.requestId}`);

  try {
    // Load request from database
    const request = await prisma.request.findUnique({
      where: { id: state.requestId },
      include: {
        customer: true,
        tasks: true,
      },
    });

    if (!request) {
      return {
        ...state,
        iteration: (state.iteration ?? 0) + 1,
        error: `Request not found: ${state.requestId}`,
      };
    }

    // If we have raw input and no normalized payload, normalize it
    let normalizedPayload = request.payload as unknown as NormalizedPayload;

    if (state.rawInput && !normalizedPayload) {
      console.log("[OBSERVE] Normalizing raw input...");
      const raw = await callGemini(normalizePrompt(state.rawInput));
      try {
        normalizedPayload = JSON.parse(raw);
        // Update request with normalized payload
        await prisma.request.update({
          where: { id: state.requestId },
          data: { payload: normalizedPayload as any },
        });
      } catch (parseError) {
        console.error("[OBSERVE] Failed to parse normalized payload:", parseError);
      }
    }

    return {
      request: { ...request, payload: normalizedPayload as any },
      customer: request.customer ?? undefined,
      iteration: (state.iteration ?? 0) + 1,
    };
  } catch (error) {
    console.error("[OBSERVE] Error:", error);
    return {
      iteration: (state.iteration ?? 0) + 1,
      error: `Observe error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
