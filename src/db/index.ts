import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

import * as schema from "./schema";

const client = new SQL(
    process.env.DATABASE_URL ?? (() => {
        throw new Error("DATABASE_URL is not set");
    })(),
);

/**
 * Drizzle database instance. Import this wherever you need to query.
 * Uses `bun:sql` as the underlying PostgreSQL driver.
 */
export const db = drizzle(client, { schema });
