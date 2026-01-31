// graph/index.ts
import { StateGraph, END, START, Annotation } from "@langchain/langgraph";
import type { OpsState, InventoryCheck, StaffLoad, AgentDecision, PlannedTask } from "../prompts/state";
import { observeNode } from "./nodes/observe.node";
import { orientNode } from "./nodes/orient.node";
import { decideNode } from "./nodes/decide.node";
import { planTasksNode } from "./nodes/planTasks.node";
import { actNode } from "./nodes/act.node";
import { respondNode } from "./nodes/respond.node";

/**
 * State annotation for LangGraph
 * Uses Annotation.Root for proper state management
 */
const OpsStateAnnotation = Annotation.Root({
    requestId: Annotation<string>({ reducer: (a, b) => b ?? a, default: () => "" }),
    request: Annotation<any>({ reducer: (a, b) => b ?? a, default: () => undefined }),
    customer: Annotation<any>({ reducer: (a, b) => b ?? a, default: () => undefined }),
    rawInput: Annotation<string | undefined>({ reducer: (a, b) => b ?? a, default: () => undefined }),
    inventory: Annotation<any[]>({ reducer: (a, b) => b ?? a, default: () => [] }),
    inventoryCheck: Annotation<InventoryCheck | undefined>({ reducer: (a, b) => b ?? a, default: () => undefined }),
    staff: Annotation<any[]>({ reducer: (a, b) => b ?? a, default: () => [] }),
    staffLoad: Annotation<StaffLoad[]>({ reducer: (a, b) => b ?? a, default: () => [] }),
    activeTasks: Annotation<any[]>({ reducer: (a, b) => b ?? a, default: () => [] }),
    decision: Annotation<AgentDecision | undefined>({ reducer: (a, b) => b ?? a, default: () => undefined }),
    plannedTasks: Annotation<PlannedTask[] | undefined>({ reducer: (a, b) => b ?? a, default: () => undefined }),
    response: Annotation<string | undefined>({ reducer: (a, b) => b ?? a, default: () => undefined }),
    iteration: Annotation<number>({ reducer: (a, b) => b ?? a, default: () => 0 }),
    error: Annotation<string | undefined>({ reducer: (a, b) => b ?? a, default: () => undefined }),
});

type DecisionRoute = "planTasks" | "act" | "respond";

/**
 * Decision routing function for conditional edges
 * Routes based on the agent's decision action
 */
function routeAfterDecision(state: typeof OpsStateAnnotation.State): DecisionRoute {
    if (!state.decision) {
        return "respond"; // Fallback if no decision
    }

    switch (state.decision.action) {
        case "ACCEPT_AND_PLAN":
            return "planTasks";
        case "DELAY_REQUEST":
            return "act"; // Act node will handle delay logic
        case "ESCALATE_TO_OWNER":
            return "act"; // Act node will handle escalation
        default:
            return "respond";
    }
}

/**
 * Build the LangGraph workflow
 */
function buildOpsGraph() {
    const graph = new StateGraph(OpsStateAnnotation);

    // Add nodes
    graph.addNode("observe", observeNode);
    graph.addNode("orient", orientNode);
    graph.addNode("decide", decideNode);
    graph.addNode("planTasks", planTasksNode);
    graph.addNode("act", actNode);
    graph.addNode("respond", respondNode);

    // Set entry point
    graph.addEdge(START, "observe");

    // Linear flow: observe → orient → decide
    graph.addEdge("observe", "orient");
    graph.addEdge("orient", "decide");

    // Conditional routing after decide
    graph.addConditionalEdges("decide", routeAfterDecision, {
        planTasks: "planTasks",
        act: "act",
        respond: "respond",
    });

    // After planning, go to act
    graph.addEdge("planTasks", "act");

    // After act, always respond
    graph.addEdge("act", "respond");

    // End after respond
    graph.addEdge("respond", END);

    return graph.compile();
}

// Export compiled graph
export const opsGraph = buildOpsGraph();

/**
 * Helper function to invoke the agent workflow
 */
export async function invokeAgent(requestId: string, rawInput?: string, overrides?: Partial<OpsState>): Promise<OpsState> {
    const initialState: Partial<OpsState> = {
        requestId,
        rawInput,
        iteration: 0,
        ...overrides,
    };

    // We need to ensure nested objects like 'request' are merged if provided in overrides,
    // but here we trust overrides to be top-level properties or complete objects.

    const result = await opsGraph.invoke(initialState);
    return result as unknown as OpsState;
}

/**
 * Helper function to stream agent workflow events
 */
export async function* streamAgent(requestId: string, rawInput?: string) {
    const initialState = {
        requestId,
        rawInput,
        iteration: 0,
    };

    for await (const event of await opsGraph.stream(initialState)) {
        yield event;
    }
}
