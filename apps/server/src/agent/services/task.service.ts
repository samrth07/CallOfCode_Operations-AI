// services/task.service.ts
import prisma from "@Hackron/db";
import type { PlannedTask } from "../graph/state";

/**
 * Create tasks in the database from planned tasks
 */
export async function createTasksFromPlan(
    requestId: string,
    plannedTasks: PlannedTask[]
): Promise<string[]> {
    const taskIds: string[] = [];

    for (const task of plannedTasks) {
        const created = await prisma.task.create({
            data: {
                requestId,
                title: task.title,
                description: task.description,
                requiredSkills: task.requiredSkills,
                estimatedMin: task.estimatedMin,
                status: task.suggestedWorkerId ? "ASSIGNED" : "PENDING",
                assignedToId: task.suggestedWorkerId,
            },
        });
        taskIds.push(created.id);
    }

    return taskIds;
}

/**
 * Find the best worker for a task based on skills and workload
 */
export async function findBestWorker(
    requiredSkills: string[]
): Promise<string | null> {
    // Get all active workers with matching skills
    const workers = await prisma.user.findMany({
        where: {
            role: "WORKER",
            isActive: true,
            skills: {
                hasSome: requiredSkills,
            },
        },
        include: {
            tasks: {
                where: {
                    status: { in: ["PENDING", "ASSIGNED", "IN_PROGRESS"] },
                },
            },
        },
    });

    if (workers.length === 0) return null;

    // Sort by number of active tasks (ascending) and skill match (descending)
    const scored = workers.map((worker) => {
        const skillMatch = worker.skills.filter((s) => requiredSkills.includes(s)).length;
        const activeTaskCount = worker.tasks.length;
        return {
            id: worker.id,
            score: skillMatch * 10 - activeTaskCount, // Higher is better
        };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.id ?? null;
}

/**
 * Assign a task to a worker
 */
export async function assignTask(
    taskId: string,
    workerId: string
): Promise<void> {
    await prisma.task.update({
        where: { id: taskId },
        data: {
            assignedToId: workerId,
            status: "ASSIGNED",
        },
    });
}

/**
 * Get worker's current load
 */
export async function getWorkerLoad(workerId: string): Promise<{
    activeTasks: number;
    estimatedMinutesRemaining: number;
}> {
    const tasks = await prisma.task.findMany({
        where: {
            assignedToId: workerId,
            status: { in: ["PENDING", "ASSIGNED", "IN_PROGRESS"] },
        },
    });

    return {
        activeTasks: tasks.length,
        estimatedMinutesRemaining: tasks.reduce((sum, t) => sum + (t.estimatedMin || 0), 0),
    };
}
