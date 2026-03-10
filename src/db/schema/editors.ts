import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Internal editors who can create and modify {@linkcode newsPosts}.
 * Accounts are created manually via seed script.
 * Auth is TOTP-based, no passwords stored.
 */
export const editors = pgTable("editors", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	/** Org email, e.g. `begumay@haber.ulus.org.tr` */
	email: text("email").notNull().unique(),
	/** TOTP secret for authenticator app. Set once on account creation. */
	totpSecret: text("totp_secret").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});
