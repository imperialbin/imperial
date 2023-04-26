import { Command } from "@bot/commands/commands";
import { createEmbed } from "@bot/utils/embeds";
import { env } from "@bot/utils/env";
import { db } from "../../db";
import { users } from "@imperial/internal";
import { sql } from "drizzle-orm";

export const unlink: Command = {
  name: "unlink",
  description: "Unlink your IMPERIAL account with your Discord",
  run: async (client, interaction) => {
    const userID = interaction.user.id;

    const connectedUser =
      (
        await db
          .select()
          .from(users)
          .where(sql`${users.discord}->>'id' = ${userID}`)
      )?.[0] ?? null;

    if (!connectedUser) {
      return interaction.reply({
        embeds: [
          createEmbed(
            "Oopsie",
            "This Discord account is not connected to an IMPERIAL account.",
            interaction,
            true
          ),
        ],
        ephemeral: true,
      });
    }

    await db
      .update(users)
      .set({
        discord: null,
      })
      .where(sql`${users.discord}->>'id' = ${userID}`);

    interaction.reply({
      embeds: [
        createEmbed(
          "Success",
          "Your Discord account has been unlinked from your IMPERIAL account.",
          interaction,
          false
        ),
      ],
      ephemeral: true,
    });
  },
};
