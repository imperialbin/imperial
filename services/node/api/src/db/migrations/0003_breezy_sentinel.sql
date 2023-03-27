CREATE TABLE IF NOT EXISTS "devices" (
	"id" text PRIMARY KEY NOT NULL,
	"user" integer,
	"user_agent" text NOT NULL,
	"ip" text NOT NULL,
	"auth_token" text NOT NULL,
	"created_at" text NOT NULL
);

DO $$ BEGIN
 ALTER TABLE devices ADD CONSTRAINT devices_user_users_id_fk FOREIGN KEY ("user") REFERENCES users("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
