CREATE TYPE "public"."news_post_state" AS ENUM('corrected', 'under_review', 'verified', 'uncertain');--> statement-breakpoint
CREATE TABLE "editors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"totp_secret" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "editors_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "news_post_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"editor_id" integer NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"state" "news_post_state" NOT NULL,
	"change_reason" text,
	"is_significant" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"publisher_url" text NOT NULL,
	"state" "news_post_state" DEFAULT 'uncertain' NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"editor_id" integer NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "news_post_versions" ADD CONSTRAINT "news_post_versions_post_id_news_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."news_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_post_versions" ADD CONSTRAINT "news_post_versions_editor_id_editors_id_fk" FOREIGN KEY ("editor_id") REFERENCES "public"."editors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_editor_id_editors_id_fk" FOREIGN KEY ("editor_id") REFERENCES "public"."editors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "posts_search_index" ON "news_posts" USING gin (to_tsvector('turkish',  || ' ' || "content"));