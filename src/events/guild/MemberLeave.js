import { Events } from "discord.js";
import { getLogChannel } from "../utils/getLogChannel.js";
export const name = Events.GuildMemberRemove;
export const once = false;
export async function execute(member) {
    const logChannel = getLogChannel(member.guild);
    if (!logChannel)
        return;
    await logChannel.send({
        embeds: [{
                color: 0xED4245,
                title: "📤 Member Left",
                description: `${member.user.tag}`,
                thumbnail: { url: member.displayAvatarURL() },
                footer: { text: `ID: ${member.id}` },
                timestamp: new Date().toISOString(),
            }]
    }).catch(() => { });
}
//# sourceMappingURL=MemberLeave.js.map