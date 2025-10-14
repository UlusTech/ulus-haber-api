import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/database/schema.ts",
    dialect: "postgresql",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },

    migrations: {
        table: "migrations",
        schema: "public",
    },
    verbose: true,
    strict: true,
});
