import { Events } from "discord.js";
import { getLogChannel } from "../utils/getLogChannel.js";
export const name = Events.MessageDelete;
export const once = false;
export async function execute(message) {
    if (!message.guild || message.author.bot)
        return;
    const logChannel = getLogChannel(message.guild);
    if (!logChannel)
        return;
    await logChannel.send({
        embeds: [{
                color: 0xED4245,
                title: "🗑️ Message Deleted",
                description: `**Channel:** ${message.channel}\n**Author:** ${message.author.tag}\n**Content:**\n\`\`\`${message.content || "[No content]"}\`\`\``,
                thumbnail: { url: message.author.displayAvatarURL() },
                footer: { text: `Message ID: ${message.id}` },
                timestamp: new Date().toISOString(),
            }]
    }).catch(() => { });
}
//# sourceMappingURL=MessageDelete.js.map