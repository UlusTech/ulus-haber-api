import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { editors } from "./editors";

/**
 * Active editor sessions. The `id` itself is the token sent in requests.
 * Sessions expire after 7 days. Expired sessions are never auto-cleaned —
 * check `expiresAt` on every authenticated request.
 */
export const sessions = pgTable("sessions", {
	/** Random token. This is what the client sends as a bearer token. */
	id: text("id").primaryKey(),
	editorId: integer("editor_id")
		.notNull()
		.references(() => editors.id, { onDelete: "cascade" }),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});
