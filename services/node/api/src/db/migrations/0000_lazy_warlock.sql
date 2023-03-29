CREATE TABLE IF NOT EXISTS "devices" (
	"id" text PRIMARY KEY NOT NULL,
	"user" text,
	"user_agent" text NOT NULL,
	"ip" text NOT NULL,
	"auth_token" text NOT NULL,
	"created_at" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "documents" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"gist_id" text,
	"creator" text,
	"views" integer DEFAULT 0 NOT NULL,
	"created_at" text DEFAULT '' NOT NULL,
	"expires_at" text,
	"settings" json NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"icon" text,
	"confirmed" boolean DEFAULT false NOT NULL,
	"password" text NOT NULL,
	"documents_made" integer DEFAULT 0 NOT NULL,
	"api_token" text NOT NULL,
	"banned" boolean DEFAULT false NOT NULL,
	"flags" integer DEFAULT 0 NOT NULL,
	"settings" json NOT NULL,
	"github" json,
	"discord" json
);

DO $$ BEGIN
 ALTER TABLE devices ADD CONSTRAINT devices_user_users_id_fk FOREIGN KEY ("user") REFERENCES users("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE documents ADD CONSTRAINT documents_creator_users_id_fk FOREIGN KEY ("creator") REFERENCES users("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
