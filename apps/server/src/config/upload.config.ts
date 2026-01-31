import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import { env } from "@Hackron/env/server";

// Initialize Supabase client
export const supabase = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
);

// Configure Multer for file uploads
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
