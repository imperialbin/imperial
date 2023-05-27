ALTER TABLE "member_plus_tokens" ADD COLUMN "claimed_by" text;
DO $$ BEGIN
 ALTER TABLE "member_plus_tokens" ADD CONSTRAINT "member_plus_tokens_claimed_by_users_id_fk" FOREIGN KEY ("claimed_by") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
