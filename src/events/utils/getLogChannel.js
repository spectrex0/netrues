export function getLogChannel(guild) {
    const logChannel = guild.channels.cache.find(channel => channel.name === "netrues-bot-logs" && channel.isTextBased());
    return logChannel;
}
//# sourceMappingURL=getLogChannel.js.map