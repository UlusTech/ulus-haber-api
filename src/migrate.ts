import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./database/client";

await migrate(db, { migrationsFolder: "./drizzle" });
