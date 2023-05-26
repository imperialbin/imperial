import { Command } from "@bot/commands/commands";
import { createEmbed } from "@bot/utils/embeds";
import { env } from "@bot/utils/env";
import { db } from "../../db";
import { users } from "@imperial/internal";
import { sql } from "drizzle-orm";

export const link: Command = {
  name: "link",
  description: "Link your IMPERIAL account with your Discord",
  run: async (client, interaction) => {
    const userID = interaction.user.id;

    const connectedUser =
      (
        await db
          .select()
          .from(users)
          .where(sql`${users.discord}->>'id' = ${userID}`)
      )?.[0] ?? null;

    if (connectedUser) {
      return interaction.reply({
        embeds: [
          createEmbed(
            "Oopsie",
            "You're already connected!",
            interaction,
            true,
            [
              {
                inline: true,
                name: "Relink?",
                value: `${env.FRONTEND_URL}/link/discord`,
              },
            ]
          ),
        ],
        ephemeral: true,
      });
    }

    interaction.reply({
      embeds: [
        createEmbed(
          "Link your account",
          "Linking your account is easy, simple click the link below, then your IMPERIAL account will automatically be linked with your Discord account",
          interaction,
          false,
          [
            {
              name: "Link account",
              value: `${env.FRONTEND_URL}/link/discord`,
              inline: false,
            },
          ]
        ),
      ],
      ephemeral: true,
    });
  },
};
