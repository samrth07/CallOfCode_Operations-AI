// seed/index.ts
// Seed script to populate the database with test data from CSV files
import { config } from "dotenv";
import { join } from "path";

// Load environment variables from .env file
config({ path: join(process.cwd(), ".env") });

import prisma from "@Hackron/db";

import { readFileSync } from "fs";

const SEED_DIR = join(process.cwd(), "seed");

console.log("📂 Seed directory:", SEED_DIR);
console.log("🔌 DATABASE_URL:", process.env.DATABASE_URL ? "Set (length: " + process.env.DATABASE_URL.length + ")" : "Not Set");

if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is missing. Please check your .env file.");
    process.exit(1);
}

interface UserRow {
    id: string;
    name: string;
    phone: string;
    role: "OWNER" | "WORKER" | "CUSTOMER";
    skills: string;
    isActive: string;
}

interface CustomerRow {
    id: string;
    name: string;
    phone: string;
}

interface InventoryRow {
    id: string;
    sku: string;
    name: string;
    quantity: string;
    reorderPoint: string;
}

interface RequestRow {
    id: string;
    customerId: string;
    source: string;
    status: "NEW" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "CANCELLED";
    priority: string;
    payload: string;
}

function parseCSV<T>(filename: string): T[] {
    const filePath = join(SEED_DIR, filename);
    console.log(`📄 Parsing ${filePath}...`);
    const content = readFileSync(filePath, "utf-8");
    const lines = content.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",");

    return lines.slice(1).map((line) => {
        const values: string[] = [];
        let current = "";
        let inQuotes = false;

        for (const char of line) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === "," && !inQuotes) {
                values.push(current);
                current = "";
            } else {
                current += char;
            }
        }
        values.push(current);

        const obj: Record<string, string> = {};
        headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.trim() ?? "";
        });
        return obj as T;
    });
}

async function seedUsers() {
    console.log("🌱 Seeding users...");
    const users = parseCSV<UserRow>("users.csv");

    for (const user of users) {
        await prisma.user.upsert({
            where: { id: user.id },
            update: {},
            create: {
                id: user.id,
                name: user.name,
                phone: user.phone || null,
                role: user.role,
                skills: user.skills ? user.skills.split(",").map((s) => s.trim()) : [],
                isActive: user.isActive === "true",
            },
        });
    }
    console.log(`✅ Seeded ${users.length} users`);
}

async function seedCustomers() {
    console.log("🌱 Seeding customers...");
    const customers = parseCSV<CustomerRow>("customers.csv");

    for (const customer of customers) {
        await prisma.customer.upsert({
            where: { id: customer.id },
            update: {},
            create: {
                id: customer.id,
                name: customer.name,
                phone: customer.phone,
            },
        });
    }
    console.log(`✅ Seeded ${customers.length} customers`);
}

async function seedInventory() {
    console.log("🌱 Seeding inventory...");
    const items = parseCSV<InventoryRow>("inventory.csv");

    for (const item of items) {
        await prisma.inventoryItem.upsert({
            where: { id: item.id },
            update: {},
            create: {
                id: item.id,
                sku: item.sku,
                name: item.name,
                quantity: parseInt(item.quantity, 10),
                reorderPoint: parseInt(item.reorderPoint, 10),
            },
        });
    }
    console.log(`✅ Seeded ${items.length} inventory items`);
}

async function seedRequests() {
    console.log("🌱 Seeding requests...");
    // Hardcoded requests to avoid CSV parsing issues with JSON
    const requests: any[] = [
        {
            id: "req-001",
            customerId: "cust-001",
            source: "web",
            status: "NEW",
            priority: 5,
            payload: {
                type: "alteration",
                items: [{ sku: "SH-001", qty: 1, size: "M", alteration_type: "sleeve_shortening", measurement: { sleeve_cm: 58 } }],
                required_skills: ["tailoring"],
                estimated_minutes: 45,
                notes: "Shorten sleeves by 3cm"
            }
        },
        {
            id: "req-002",
            customerId: "cust-002",
            source: "whatsapp",
            status: "NEW",
            priority: 3,
            payload: {
                type: "stitching",
                items: [{ sku: "BL-001", qty: 2, size: "S", color: "Red" }],
                required_skills: ["stitching", "tailoring"],
                estimated_minutes: 120,
                notes: "Custom blouse stitching"
            }
        },
        {
            id: "req-003",
            customerId: "cust-003",
            source: "web",
            status: "NEW",
            priority: 7,
            payload: {
                type: "order",
                items: [{ sku: "KU-001", qty: 3, size: "L", color: "White" }],
                required_skills: ["tailoring"],
                estimated_minutes: 180,
                notes: "Bulk kurta order for wedding"
            }
        }
    ];

    for (const req of requests) {
        await prisma.request.upsert({
            where: { id: req.id },
            update: {},
            create: {
                id: req.id,
                customerId: req.customerId,
                source: req.source,
                status: req.status, // TypeScript validation might fail if enum mismatch, casting needed
                priority: req.priority,
                payload: req.payload,
            },
        });
    }
    console.log(`✅ Seeded ${requests.length} requests`);
}

async function main() {
    console.log("\n🚀 Starting database seed...\n");

    try {
        console.log("🔌 Connecting to database...");
        await prisma.$connect();
        console.log("✅ Connected!");

        await seedUsers();
        await seedCustomers();
        await seedInventory();
        await seedRequests();

        console.log("\n✨ Database seeding complete!\n");
        console.log("Test request IDs for agent testing:");
        console.log("  - req-001: Alteration (sleeve shortening)");
        console.log("  - req-002: Custom stitching");
        console.log("  - req-003: Bulk order\n");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        if (error && typeof error === 'object') {
            if ('code' in error) console.error("Prisma Code:", (error as any).code);
            if ('meta' in error) console.error("Prisma Meta:", (error as any).meta);
            if ('clientVersion' in error) console.error("Client Version:", (error as any).clientVersion);
        }
        process.exit(1);
    }
}

main();
