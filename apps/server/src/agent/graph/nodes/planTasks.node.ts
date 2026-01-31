// nodes/planTasks.node.ts
import type { OpsState, PlannedTask, NormalizedPayload } from "../state";
import { planTasksPrompt } from "../../prompts/planTasks.prompt";
import { callGemini, extractJSON } from "../../services/gemini.service";

/**
 * Plan Tasks Node
 * Purpose: Break down work into operational tasks
 * - Only runs when decision is ACCEPT_AND_PLAN
 * - Creates task breakdown with skills and estimates
 * - Suggests worker assignment based on skills and workload
 */
export async function planTasksNode(state: OpsState): Promise<Partial<OpsState>> {
  console.log("[PLAN_TASKS] Planning tasks...");

  // Only plan if decision is ACCEPT_AND_PLAN
  if (state.decision?.action !== "ACCEPT_AND_PLAN") {
    console.log("[PLAN_TASKS] Skipping - decision is not ACCEPT_AND_PLAN");
    return {};
  }

  if (!state.request?.payload) {
    console.warn("[PLAN_TASKS] No payload to plan tasks for");
    return {};
  }

  try {
    const payload = state.request.payload as unknown as NormalizedPayload;

    // Include staff info for worker suggestions
    const contextForPlanning = {
      order: payload,
      availableWorkers: state.staffLoad.map(s => ({
        id: s.id,
        name: s.name,
        skills: s.skills,
        currentLoad: s.activeTasks,
        estimatedFreeIn: s.estimatedMinutesRemaining,
      })),
    };

    const prompt = planTasksPrompt(contextForPlanning);
    const raw = await callGemini(prompt);

    const jsonStr = extractJSON(raw);
    const plannedTasks = JSON.parse(jsonStr) as PlannedTask[];

    // Validate and fix task structure
    const validatedTasks: PlannedTask[] = plannedTasks.map(task => ({
      title: task.title || "Untitled Task",
      description: task.description,
      requiredSkills: Array.isArray(task.requiredSkills) ? task.requiredSkills : [],
      estimatedMin: typeof task.estimatedMin === "number" ? task.estimatedMin : 30,
      suggestedWorkerId: task.suggestedWorkerId,
    }));

    console.log(`[PLAN_TASKS] Planned ${validatedTasks.length} tasks`);
    return { plannedTasks: validatedTasks };

  } catch (error) {
    console.error("[PLAN_TASKS] Error:", error);
    // Create a generic task as fallback
    return {
      plannedTasks: [{
        title: "Process Request",
        description: "Generic task created due to planning error",
        requiredSkills: [],
        estimatedMin: 60,
      }],
    };
  }
}
