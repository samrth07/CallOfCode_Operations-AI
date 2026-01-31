import type { Request, Response } from "express";
import { invokeAgent } from "../../agent/graph";
import prisma from "@Hackron/db";

/**
 * Agent Controller - Handles internal agent communication
 * These endpoints are only accessible via internal API key
 *
 * Uses LangGraph for agent workflow orchestration
 */
export class AgentController {
    /**
     * POST /internal/agent/enqueue
     * Queue a request for agent processing
     */
    async enqueueRequest(req: Request, res: Response): Promise<void> {
        const { requestId, rawInput } = req.body as {
            requestId?: string;
            rawInput?: string;
        };

        if (!requestId) {
            res.status(400).json({
                success: false,
                error: "requestId is required",
            });
            return;
        }

        try {
            // Invoke the agent workflow
            console.log(`[AGENT] Enqueuing request: ${requestId}`);
            const result = await invokeAgent(requestId, rawInput);

            res.status(200).json({
                success: true,
                message: "Request processed by agent",
                requestId,
                decision: result.decision,
                tasksCreated: result.plannedTasks?.length ?? 0,
                response: result.response,
                error: result.error,
            });
        } catch (error) {
            console.error("[AGENT] Enqueue error:", error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }

    /**
     * POST /internal/agent/re-evaluate/:requestId
     * Trigger re-evaluation of an existing request
     */
    async reEvaluateRequest(req: Request, res: Response): Promise<void> {
        const requestId = req.params.requestId as string;

        if (!requestId) {
            res.status(400).json({
                success: false,
                error: "requestId is required",
            });
            return;
        }

        try {
            // Check if request exists
            const request = await prisma.request.findUnique({
                where: { id: requestId },
            });

            if (!request) {
                res.status(404).json({
                    success: false,
                    error: "Request not found",
                });
                return;
            }

            console.log(`[AGENT] Re-evaluating request: ${requestId}`);
            const result = await invokeAgent(requestId);

            res.status(200).json({
                success: true,
                message: "Re-evaluation completed",
                requestId,
                decision: result.decision,
                tasksCreated: result.plannedTasks?.length ?? 0,
                response: result.response,
                error: result.error,
            });
        } catch (error) {
            console.error("[AGENT] Re-evaluate error:", error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }

    /**
     * POST /internal/agent/simulate
     * Simulate agent decision without side effects
     * Useful for testing agent logic without database changes
     */
    async simulateDecision(req: Request, res: Response): Promise<void> {
        const { requestId, rawInput } = req.body as {
            requestId?: string;
            rawInput?: string;
        };

        // For simulation, we can accept raw input without a request ID if needed,
        // but currently verifyRequest needs an ID.
        // If we want purely stateless simulation, we might need to mock fetching the request.
        // For now, let's assume we simulate on an existing or ephemeral request,
        // or we just rely on invokeAgent handling missing ID if we adapt it.
        // Based on current invokeAgent, it takes requestId.

        if (!requestId) {
            res.status(400).json({ error: "requestId is required for simulation" });
            return;
        }

        try {
            console.log(`[AGENT] Simulating decision for: ${requestId}`);
            // Pass isSimulation flag via the second argument (input payload override) logic
            // Wait, invokeAgent signature is (requestId: string, rawInput?: string)
            // We need to pass the extra state. invokeAgent needs update or we pass it via rawInput hack?
            // No, invokeAgent calls `opsGraph.compile().invoke(...)`.
            // We should update invokeAgent to accept initial state overrides.

            const result = await invokeAgent(requestId, rawInput, { isSimulation: true });

            res.status(200).json({
                success: true,
                message: "Simulation complete",
                decision: result.decision,
                reason: result.decision?.reason,
                wouldCreateTasks: (result.plannedTasks?.length ?? 0) > 0,
                plannedTasks: result.plannedTasks,
            });
        } catch (error) {
            console.error("[AGENT] Simulation error:", error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
}

export const agentController = new AgentController();
