import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Use database URL from environment
const connectionString = process.env.DATABASE_URL || "";
const sql = postgres(connectionString);
export const db = drizzle(sql);
