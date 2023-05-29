import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { Pool } from "pg";
import { env } from "../utils/env";
import { Logger } from "../utils/logger";
import * as schema from "@imperial/internal";

export let db: ReturnType<typeof drizzle<typeof schema>>;

export const setupDB = async () => {
  const pool = await new Pool({
    connectionString: env.DATABASE_URL,
  })
    .connect()
    .then((client) => {
      Logger.info("INIT", "Connected to database");

      return client;
    })
    .catch((err) => {
      Logger.error("INIT", `Failed to connect to database ${String(err)}}`);
      process.exit(1);
    });

  db = drizzle(pool, { schema });

  await migrate(db, {
    migrationsFolder: "../../packages/internal/db/migrations",
  })
    .then(() => {
      Logger.info("INIT", "Migrated database");
    })
    .catch((err) => {
      Logger.error("INIT", `Failed to migrate database ${String(err)}`);
      process.exit(1);
    });
};
