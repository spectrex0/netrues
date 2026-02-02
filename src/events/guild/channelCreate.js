import { Events } from "discord.js";
import { getLogChannel } from "../utils/getLogChannel.js";
export const name = Events.ChannelCreate;
export const once = false;
export async function execute(channel) {
    if (!channel.isTextBased())
        return;
    const logChannel = getLogChannel(channel.guild);
    if (!logChannel)
        return;
    await logChannel.send({
        embeds: [{
                color: 0x57F287,
                title: "🆕 Channel Created",
                description: `**${channel.name}** (${channel.type})`,
                footer: { text: `ID: ${channel.id}` },
                timestamp: new Date().toISOString(),
            }]
    }).catch(() => { });
}
//# sourceMappingURL=channelCreate.js.map