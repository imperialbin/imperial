CREATE TABLE IF NOT EXISTS "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"gist_url" text,
	"creator" integer,
	"views" integer DEFAULT 0,
	"created_at" text DEFAULT '',
	"expires_at" text,
	"settings" json
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"icon" text,
	"confirmed_email" boolean DEFAULT false,
	"password" text NOT NULL,
	"documents_made" integer DEFAULT 0,
	"api_token" text NOT NULL,
	"banned" boolean DEFAULT false,
	"flags" integer DEFAULT 0,
	"settings" json,
	"github" json,
	"discord" json
);

DO $$ BEGIN
 ALTER TABLE documents ADD CONSTRAINT documents_creator_users_id_fk FOREIGN KEY ("creator") REFERENCES users("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
