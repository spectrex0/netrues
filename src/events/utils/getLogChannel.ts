import { Guild, TextChannel } from "discord.js";

export function getLogChannel(guild: Guild): TextChannel | null {
  const logChannel = guild.channels.cache.find(
    channel => channel.name === "netrues-bot-logs" && channel.isTextBased()
  ) as TextChannel | null;

  return logChannel;
}