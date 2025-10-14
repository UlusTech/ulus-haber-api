import { integer, jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export enum NewsPostState {
    /**
     * Changed after {@linkcode UnderReview}
     */
    Corrected = 0,
    /**
     * Reviewing {@linkcode Uncertain}
     */
    UnderReview = 1,
    /**
     * Verifyed and proven to be true. Still, it can get {@linkcode UnderReview} and {@linkcode Corrected} and verifyed agein
     */
    Verifyed = 2,
    /**
     * Not Reviewed. Maybe no way to correct or verify and cant get it {@linkcode UnderReview}
     */
    Uncertain = 3,
}

export const newsPosts = pgTable("news_posts", {
    id: text("id").primaryKey(),
    /**
     * There is always an owner and co-owners.
     */
    publisher: jsonb("publisher").notNull(),
    /**
     * The post content in markdown format.
     */
    content: text("content").notNull(),
    files: jsonb("files").notNull(),
    /**
     * The state of the post that to keep information reliability high.
     */
    state: integer("state").notNull().default(NewsPostState.Uncertain),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type NewsPostDB = InferSelectModel<typeof newsPosts>;
export type NewNewsPost = InferInsertModel<typeof newsPosts>;
