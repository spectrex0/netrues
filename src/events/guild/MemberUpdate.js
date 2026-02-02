import { Events } from "discord.js";
import { getLogChannel } from "../utils/getLogChannel.js";
export const name = Events.GuildMemberUpdate;
export const once = false;
export async function execute(oldMember, newMember) {
    const logChannel = getLogChannel(newMember.guild);
    if (!logChannel)
        return;
    if (oldMember.nickname !== newMember.nickname) {
        await logChannel.send({
            embeds: [{
                    color: 0xFEE75C,
                    title: "✏️ Nickname Updated",
                    description: `${newMember.user.tag}\nBefore: \`${oldMember.nickname || 'None'}\`\nAfter: \`${newMember.nickname || 'None'}\``,
                    thumbnail: { url: newMember.displayAvatarURL() },
                    timestamp: new Date().toISOString(),
                }]
        }).catch(() => { });
    }
    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
    if (addedRoles.size > 0) {
        await logChannel.send({
            embeds: [{
                    color: 0x57F287,
                    title: "➕ Role Added",
                    description: `${newMember.user.tag}\n${addedRoles.map(r => r.name).join(', ')}`,
                    timestamp: new Date().toISOString(),
                }]
        }).catch(() => { });
    }
    if (removedRoles.size > 0) {
        await logChannel.send({
            embeds: [{
                    color: 0xED4245,
                    title: "➖ Role Removed",
                    description: `${newMember.user.tag}\n${removedRoles.map(r => r.name).join(', ')}`,
                    timestamp: new Date().toISOString(),
                }]
        }).catch(() => { });
    }
}
//# sourceMappingURL=MemberUpdate.js.map