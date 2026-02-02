import { Events } from "discord.js";
import { getLogChannel } from "../utils/getLogChannel.ts";
export const name = Events.GuildBanAdd;
export const once = false;
export async function execute(ban) {
    const logChannel = getLogChannel(ban.guild);
    if (!logChannel)
        return;
    await logChannel.send({
        embeds: [{
                color: 0xED4245,
                title: "🚫 User Banned",
                description: `${ban.user.tag}`,
                thumbnail: { url: ban.user.displayAvatarURL() },
                footer: { text: `ID: ${ban.user.id}` },
                timestamp: new Date().toISOString(),
            }]
    }).catch(() => { });
}
//# sourceMappingURL=GuildBanAdd.js.map