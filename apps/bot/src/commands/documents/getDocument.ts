import { Command } from "@bot/commands/commands";
import { API } from "@bot/utils/api";
import { createEmbed } from "@bot/utils/embeds";
import { ApplicationCommandOptionType, codeBlock } from "discord.js";

export const getDocument: Command = {
  name: "get",
  description: "Get a document on IMPERIAL",
  options: [
    {
      name: "id",
      description: "The ID of the document",
      minLength: 1,
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "password",
      description: "The password to decrypt the document with",
      required: false,
      type: ApplicationCommandOptionType.String,
    },
  ],
  run: async (client, interaction) => {
    const document = await API.getDocument(
      interaction.options.getString("id", true),
      "",
      interaction.options.getString("password") ?? undefined
    );

    if ("error" in document) {
      return await interaction.reply({
        ephemeral: true,
        embeds: [
          createEmbed("Oopsies", document.error.message, interaction, true),
        ],
      });
    }

    if (
      document.settings.encrypted &&
      document.content.startsWith("IMPERIAL_ENCRYPTED")
    ) {
      return await interaction.reply({
        ephemeral: true,
        embeds: [
          createEmbed(
            "Oopsies",
            "This document is encrypted and a password was not provided...",
            interaction,
            true
          ),
        ],
      });
    }

    try {
      interaction.reply({
        content: codeBlock(document.settings.language, document.content),
        ephemeral: true,
      });
    } catch {
      interaction.reply({
        content: `The document is too big to be sent in a message, here is the URL instead: ${document.links.formatted}`,
        ephemeral: true,
      });
    }
  },
};
