import { Logger, permer } from "@imperial/commons";
import { users } from "@imperial/internal";
import { StarEvent } from "@octokit/webhooks-types";
import { eq, sql } from "drizzle-orm";
import { db } from "../../../db";

export default async function (event: StarEvent) {
  const starredBy = event.sender.login;
  const user =
    (
      await db
        .select()
        .from(users)
        .where(sql`${users.github}->>'login' = ${starredBy}`)
    )[0] ?? null;

  if (!user) {
    return;
  }

  // Starred_at will be null if the user unstars the repo
  if (event.starred_at !== null) {
    const alreadyStarred = permer.test(user.flags, "star-gazer");
    if (alreadyStarred) {
      return;
    }

    await db
      .update(users)
      .set({
        flags: permer.add(user.flags, ["star-gazer"]),
      })
      .where(eq(users.id, user.id));

    Logger.info("GitHub", `Added star ${user.id}`);
  } else {
    await db
      .update(users)
      .set({
        flags: permer.subtract(user.flags, ["star-gazer"]),
      })
      .where(eq(users.id, user.id));

    Logger.info("GitHub", `Removed star ${user.id}`);
  }
}
