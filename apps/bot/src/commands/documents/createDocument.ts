import { Command } from "@bot/commands/commands";
import { API } from "@bot/utils/api";
import { createEmbed } from "@bot/utils/embeds";
import { Document } from "@imperial/commons";
import { ApplicationCommandOptionType } from "discord.js";

export const createDocument: Command = {
  name: "create",
  description: "Create a new document on IMPERIAL",
  options: [
    {
      name: "content",
      description: "The content of the document",
      minLength: 1,
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "language",
      description: "The language of the document",
      required: false,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "expiration",
      description: "The expiration of the document",
      required: false,
      type: ApplicationCommandOptionType.Integer,
    },
    {
      name: "image_embeds",
      description: "Enables OpenGraph images on documents",
      required: false,
      type: ApplicationCommandOptionType.Boolean,
    },
    {
      name: "instant_delete",
      description: "Deletes the document after it's viewed",
      required: false,
      type: ApplicationCommandOptionType.Boolean,
    },
    {
      name: "encrypted",
      description: "Encrypts the document with a password",
      required: false,
      type: ApplicationCommandOptionType.Boolean,
    },
    {
      name: "password",
      description: "The password to encrypt the document with",
      required: false,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "public",
      description: "Makes the document public",
      required: false,
      type: ApplicationCommandOptionType.Boolean,
    },
    {
      name: "long_urls",
      description: "Enables 36 character URLs on document",
      required: false,
      type: ApplicationCommandOptionType.Boolean,
    },
    {
      name: "short_urls",
      description: "Enables 4 character URLs on document",
      required: false,
      type: ApplicationCommandOptionType.Boolean,
    },
    {
      name: "create_gist",
      description: "Creates a GitHub gist with the document",
      required: false,
      type: ApplicationCommandOptionType.Boolean,
    },
  ],
  run: async (client, interaction) => {
    const userId = interaction.user.id;
    const options = {
      language: interaction.options.getString("language") ?? "plaintext",
      expiration: interaction.options.getInteger("expiration") ?? 0,
      image_embeds: interaction.options.getBoolean("image_embeds") ?? false,
      instant_delete: interaction.options.getBoolean("instant_delete") ?? false,
      encrypted: interaction.options.getBoolean("encrypted") ?? false,
      password: interaction.options.getString("password") ?? "",
      public: interaction.options.getBoolean("public") ?? false,
      long_urls: interaction.options.getBoolean("long_urls") ?? false,
      short_urls: interaction.options.getBoolean("short_urls") ?? false,
      create_gist: interaction.options.getBoolean("create_gist") ?? false,
    } as Partial<Document["settings"]>;

    const document = await API.createDocument(
      interaction.options.getString("content", true),
      options,
      userId
    );

    if ("error" in document) {
      return await interaction.reply({
        ephemeral: true,
        embeds: [
          createEmbed("Oopsies", document.error.message, interaction, true),
        ],
      });
    }

    interaction.reply({
      ephemeral: true,
      embeds: [
        createEmbed(
          document.id,
          "Successfully created document",
          interaction,
          false,
          [
            {
              name: "Formatted URL",
              value: document.links.formatted,
              inline: true,
            },
            {
              name: "Raw URL",
              value: document.links.raw,
              inline: true,
            },
          ].concat(
            document.settings.encrypted && document.settings.password
              ? [
                  {
                    name: "Password",
                    value: document.settings.password,
                    inline: false,
                  },
                ]
              : []
          )
        ),
      ],
    });
  },
};
