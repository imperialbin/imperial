ALTER TABLE documents RENAME COLUMN "gist_url" TO "gist_id";
ALTER TABLE users ALTER COLUMN "settings" SET NOT NULL;