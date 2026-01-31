import { AuditActor } from "../types/types";
import prisma from "@Hackron/db";

/**
 * Audit Service - Audit logging and tracking
 * TODO: Integrate with Prisma client from @Hackron/db
 */

export class AuditService {
    /**
     * Create an audit action record
     */
    /**
     * Create an audit action record
     */
    async createAuditAction(data: {
        requestId?: string;
        actor: AuditActor;
        action: string;
        context: any;
        reason?: string;
    }): Promise<void> {
        console.log("Creating audit action:", data);

        await prisma.auditAction.create({
            data: {
                requestId: data.requestId,
                actor: data.actor,
                action: data.action,
                context: data.context,
                reason: data.reason,
            },
        });
    }

    /**
     * Query audit logs with filters
     */
    async queryAuditLogs(filters: {
        requestId?: string;
        actor?: AuditActor;
        action?: string;
        startDate?: Date;
        endDate?: Date;
        page?: number;
        limit?: number;
    }): Promise<any> {
        const page = filters.page || 1;
        const limit = filters.limit || 50;
        const skip = (page - 1) * limit;

        console.log("Querying audit logs:", { filters, skip, limit });

        const where: any = {};

        if (filters.requestId) {
            where.requestId = filters.requestId;
        }

        if (filters.actor) {
            where.actor = filters.actor;
        }

        if (filters.action) {
            where.action = filters.action;
        }

        if (filters.startDate || filters.endDate) {
            where.createdAt = {};
            if (filters.startDate) {
                where.createdAt.gte = filters.startDate;
            }
            if (filters.endDate) {
                where.createdAt.lte = filters.endDate;
            }
        }

        const [logs, total] = await Promise.all([
            prisma.auditAction.findMany({
                where,
                skip,
                take: limit,
                include: {
                    request: true,
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.auditAction.count({ where }),
        ]);

        return {
            data: logs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}

export const auditService = new AuditService();
