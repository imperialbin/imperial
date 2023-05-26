import { COMMANDS } from "@bot/commands";
import { setupDB } from "@bot/db";
import { env } from "@bot/utils/env";
import { Logger } from "@imperial/commons";
import { ChatInputCommandInteraction, Client, Interaction } from "discord.js";
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const client = new Client({
  intents: [],
});

client.login(env.DISCORD_BOT_TOKEN);

client.on("ready", async (client) => {
  Logger.info("INIT", "Initializing bot.");

  await client.application.commands.set(COMMANDS).catch((err) => {
    console.log("err", err);
  });

  Logger.info("INIT", "Bot commands have been set!");
  Logger.info("INIT", "Bot is ready!");
  await setupDB();
});

client.on("error", (err) => {
  Logger.error("INIT", "An error occurred: " + err);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    await handleSlashCommand(client, interaction);
  }
});

const handleSlashCommand = async (
  client: Client,
  interaction: Interaction
): Promise<void> => {
  if (!interaction.isCommand()) return;

  const slashCommand = COMMANDS.find((c) => c.name === interaction.commandName);
  if (!slashCommand) {
    interaction.followUp({ content: "An error has occurred" });
    return;
  }

  slashCommand.run(client, interaction as ChatInputCommandInteraction);
};
