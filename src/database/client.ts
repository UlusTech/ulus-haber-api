import { drizzle } from "drizzle-orm/bun-sql";
import { SQL } from "bun";
import { newsPosts } from "./schema";

const client = new SQL(process.env.DATABASE_URL!);
export const db = drizzle({ client });
