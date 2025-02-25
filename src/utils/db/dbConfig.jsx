import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon("postgresql://neondb_owner:npg_oGgAUTY91hac@ep-round-mountain-a8otq96h-pooler.eastus2.azure.neon.tech/RECOPOINT?sslmode=require");
export const db = drizzle(sql, { schema });