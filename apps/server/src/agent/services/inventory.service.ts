// services/inventory.service.ts
import prisma from "@Hackron/db";

export interface InventoryCheckResult {
    available: boolean;
    items: Array<{
        sku: string;
        requested: number;
        available: number;
        shortage: number;
    }>;
}

/**
 * Check inventory availability for requested items
 */
export async function checkInventoryAvailability(
    items: Array<{ sku: string; qty: number }>
): Promise<InventoryCheckResult> {
    const results = await Promise.all(
        items.map(async (item) => {
            const invItem = await prisma.inventoryItem.findUnique({
                where: { sku: item.sku },
            });

            const available = invItem?.quantity ?? 0;
            return {
                sku: item.sku,
                requested: item.qty,
                available,
                shortage: Math.max(0, item.qty - available),
            };
        })
    );

    return {
        available: results.every((r) => r.shortage === 0),
        items: results,
    };
}

/**
 * Reserve inventory for an order (decrement quantities)
 */
export async function reserveInventory(
    items: Array<{ sku: string; qty: number }>
): Promise<void> {
    for (const item of items) {
        await prisma.inventoryItem.update({
            where: { sku: item.sku },
            data: {
                quantity: {
                    decrement: item.qty,
                },
            },
        });
    }
}

/**
 * Release reserved inventory (increment quantities)
 */
export async function releaseInventory(
    items: Array<{ sku: string; qty: number }>
): Promise<void> {
    for (const item of items) {
        await prisma.inventoryItem.update({
            where: { sku: item.sku },
            data: {
                quantity: {
                    increment: item.qty,
                },
            },
        });
    }
}
