import { drizzle } from "drizzle-orm/node-postgres";
// biome-ignore lint/performance/noNamespaceImport: drizzle requires namespace import for schema
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const url = process.env.DATABASE_URL;
const isSupabase = url?.includes("supabase.co");

export const db = drizzle({
  connection: isSupabase
    ? { connectionString: url, ssl: { rejectUnauthorized: false } }
    : url,
  schema,
});
