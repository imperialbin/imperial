import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { Pool } from "pg";
import { env } from "../utils/env";

export let db: ReturnType<typeof drizzle>;

export const setupDB = async () => {
  // Pool
  const pool = await new Pool({
    connectionString: env.DATABASE_URL,
  })
    .connect()
    .then((client) => {
      console.log("Connected to database");

      return client;
    })
    .catch((err) => {
      console.error("Failed to connect to database", err);
      process.exit(1);
    });

  db = drizzle(pool);

  // Migrate
  await migrate(db, { migrationsFolder: "src/db/migrations" })
    .then(() => {
      console.log("Migrated database");
    })
    .catch((err) => {
      console.error("Failed to migrate database", err);
      process.exit(1);
    });
};
