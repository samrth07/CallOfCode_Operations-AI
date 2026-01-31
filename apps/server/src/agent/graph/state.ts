// graph/state.ts
import type { Request, Customer, User, Task, InventoryItem } from "@Hackron/db";

/**
 * Normalized request payload for clothes business
 */
export interface NormalizedPayload {
  type: "alteration" | "order" | "stitching";
  items: Array<{
    sku: string;
    qty: number;
    size?: string;
    color?: string;
    fabric?: string;
    alteration_type?: string;
    measurement?: Record<string, number>;
  }>;
  required_skills: string[];
  estimated_minutes: number;
  preferred_slot?: {
    start: string;
    end: string;
  };
  notes?: string;
}

/**
 * Decision actions the agent can take
 */
export type DecisionAction = "ACCEPT_AND_PLAN" | "DELAY_REQUEST" | "ESCALATE_TO_OWNER";

/**
 * Decision made by the agent
 */
export interface AgentDecision {
  action: DecisionAction;
  reason: string;
  delayUntil?: string; // For DELAY_REQUEST
  escalationPriority?: "low" | "medium" | "high"; // For ESCALATE_TO_OWNER
}

/**
 * Planned task breakdown
 */
export interface PlannedTask {
  title: string;
  description?: string;
  requiredSkills: string[];
  estimatedMin: number;
  suggestedWorkerId?: string;
}

/**
 * Inventory availability check result
 */
export interface InventoryCheck {
  available: boolean;
  items: Array<{
    sku: string;
    requested: number;
    available: number;
    shortage: number;
  }>;
}

/**
 * Staff workload summary
 */
export interface StaffLoad {
  id: string;
  name: string;
  skills: string[];
  activeTasks: number;
  estimatedMinutesRemaining: number;
}

/**
 * Main operational state for the LangGraph workflow
 */
export interface OpsState {
  // Input
  requestId: string;
  request?: Request;
  customer?: Customer;
  rawInput?: string; // For WhatsApp messages that need normalization

  // Context (from orient node)
  inventory: InventoryItem[];
  inventoryCheck?: InventoryCheck;
  staff: User[];
  staffLoad: StaffLoad[];
  activeTasks: Task[];

  // Decision (from decide node)
  decision?: AgentDecision;

  // Planning (from planTasks node)
  plannedTasks?: PlannedTask[];

  // Response (from respond node)
  response?: string;

  // Metadata
  iteration: number;
  error?: string;

  // Flags
  isSimulation?: boolean;
}

/**
 * Initial state factory
 */
export function createInitialState(requestId: string, rawInput?: string): OpsState {
  return {
    requestId,
    rawInput,
    inventory: [],
    staff: [],
    staffLoad: [],
    activeTasks: [],
    iteration: 0,
  };
}
