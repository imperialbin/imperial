import { db } from "../../db";
import { users } from "@imperial/internal";
import { Command } from "../commands";
import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm/expressions";
import { createEmbed } from "../../utils/embeds";
import { env } from "../../utils/env";

export const link: Command = {
  name: "link",
  description: "Link your IMPERIAL account with your Discord",
  run: async (client, interaction) => {
    const userID = interaction.user.id;

    console.log(sql`eq(discord->>'id' = ${userID}`.queryChunks);

    /* const connectedUser =
      (
        await db
          .select()
          .from(users)
          .where(sql`discord->>'id' = '${userID}'`)
      )?.[0] ?? null; */

    if (connectedUser) {
      return interaction.reply({
        embeds: [
          createEmbed("Oopsie", "You're already connected!", interaction, true),
        ],
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
