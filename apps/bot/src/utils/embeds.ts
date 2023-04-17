import { CommandInteraction, EmbedBuilder, EmbedField } from "discord.js";
import { env } from "./env";

export const createEmbed = (
  title: string,
  description: string,
  interaction: CommandInteraction,
  error?: boolean,
  fields?: EmbedField[]
) => {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(error ? "#ff4f4f" : "#24292e")
    .setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setTimestamp()
    .setFooter({
      text: "IMPERIAL",
      iconURL: `${env.CDN_URL}/assets/IMPERIAL_TRANSPARENT.png`,
    })
    .addFields(fields ?? []);
};
