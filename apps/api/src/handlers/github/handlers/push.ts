import { Logger, permer } from "@imperial/commons";
import { users } from "@imperial/internal";
import { PushEvent } from "@octokit/webhooks-types";
import { InferModel, eq, sql } from "drizzle-orm";
import { db } from "../../../db";
import { Discord } from "../../../utils/discord";

export default async function (event: PushEvent) {
  const contributors = event.commits.map((commit) => commit.author.username);
  const uniqueContributors = [...new Set(contributors)];

  // If any SQL gurus are out there, please help me make this a single query
  const contributedUsers: Array<InferModel<typeof users>> = [];
  for (const username of uniqueContributors) {
    const user =
      (
        await db
          .select()
          .from(users)
          .where(sql`${users.github}->>'login' = ${username}`)
      )[0] ?? null;

    if (user) {
      contributedUsers.push(user);
    }
  }

  for (const user of contributedUsers) {
    const alreadyContributor = permer.test(user.flags, "contributor");
    if (alreadyContributor) {
      continue;
    }

    await db
      .update(users)
      .set({
        flags: permer.add(user.flags, ["contributor"]),
      })
      .where(eq(users.id, user.id));

    if (user.discord) {
      Discord.setRole(user.discord.id, "contributor");
    }

    Logger.info("GitHub", `Added contributor ${user.id}`);
  }
}
