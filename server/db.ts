import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";

// Use database URL from environment
const sql = neon(process.env.DATABASE_URL || "");
export const db = drizzle(sql);
