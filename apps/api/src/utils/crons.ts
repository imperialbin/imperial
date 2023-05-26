import { CronJob } from "cron";
import { sql } from "drizzle-orm";
import { db } from "../db";
import { documents } from "../db/schemas";
import { Logger } from "./logger";

export const deleteExpiredDocuments = new CronJob("0 0 * * SUN", async () => {
  const expiredDocuments = await db
    .delete(documents)
    .where(sql`${documents.expires_at}::date < NOW()::date`)
    .returning();

  Logger.success(
    "CRON",
    `Deleted ${expiredDocuments.length} expired documents`,
  );
});
