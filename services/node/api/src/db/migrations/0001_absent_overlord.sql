ALTER TABLE devices DROP CONSTRAINT devices_user_users_id_fk;
DO $$ BEGIN
 ALTER TABLE devices ADD CONSTRAINT devices_user_users_id_fk FOREIGN KEY ("user") REFERENCES users("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE documents DROP CONSTRAINT documents_creator_users_id_fk;
DO $$ BEGIN
 ALTER TABLE documents ADD CONSTRAINT documents_creator_users_id_fk FOREIGN KEY ("creator") REFERENCES users("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
