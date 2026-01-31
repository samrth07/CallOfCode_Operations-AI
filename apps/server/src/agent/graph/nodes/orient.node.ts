// nodes/orient.node.ts
import prisma from "@Hackron/db";
import type { OpsState, StaffLoad, InventoryCheck, NormalizedPayload } from "../state";

/**
 * Orient Node (Context Builder)
 * Purpose: Create a decision-ready snapshot
 * - Fetches current inventory state
 * - Fetches staff availability and workload
 * - Checks inventory availability for requested items
 * 
 * Rule: The LLM should never see raw operational data.
 */
export async function orientNode(state: OpsState): Promise<Partial<OpsState>> {
  console.log("[ORIENT] Building context...");

  try {
    // Fetch all inventory items
    const inventory = await prisma.inventoryItem.findMany();

    // Fetch active workers
    const staff = await prisma.user.findMany({
      where: {
        role: "WORKER",
        isActive: true
      },
    });

    // Fetch all active tasks
    const activeTasks = await prisma.task.findMany({
      where: {
        status: { in: ["PENDING", "ASSIGNED", "IN_PROGRESS"] }
      },
      include: {
        assignedTo: true,
      },
    });

    // Calculate staff workload
    const staffLoad: StaffLoad[] = staff.map(worker => {
      const workerTasks = activeTasks.filter(t => t.assignedToId === worker.id);
      const estimatedMinutesRemaining = workerTasks.reduce((sum, t) => sum + (t.estimatedMin || 0), 0);

      return {
        id: worker.id,
        name: worker.name,
        skills: worker.skills,
        activeTasks: workerTasks.length,
        estimatedMinutesRemaining,
      };
    });

    // Check inventory availability for the request
    let inventoryCheck: InventoryCheck | undefined;

    if (state.request?.payload) {
      const payload = state.request.payload as unknown as NormalizedPayload;
      if (payload.items && Array.isArray(payload.items)) {
        const items = payload.items.map(item => {
          const invItem = inventory.find(i => i.sku === item.sku);
          const available = invItem?.quantity ?? 0;
          const requested = item.qty ?? 1;
          return {
            sku: item.sku,
            requested,
            available,
            shortage: Math.max(0, requested - available),
          };
        });

        inventoryCheck = {
          available: items.every(i => i.shortage === 0),
          items,
        };
      }
    }

    console.log(`[ORIENT] Context built: ${inventory.length} inventory items, ${staff.length} workers, ${activeTasks.length} active tasks`);

    return {
      inventory,
      inventoryCheck,
      staff,
      staffLoad,
      activeTasks,
    };
  } catch (error) {
    console.error("[ORIENT] Error:", error);
    return {
      error: `Orient error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
