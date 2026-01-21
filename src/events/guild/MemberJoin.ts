import { Events, GuildMember } from "discord.js";
import { getLogChannel } from "../utils/getLogChannel.js";

export const name = Events.GuildMemberAdd;
export const once = false;

export async function execute(member: GuildMember) {
  const logChannel = getLogChannel(member.guild);
  if (!logChannel) return;

  await logChannel.send({
    embeds: [{
      color: 0x57F287,
      title: "📥 Member Joined",
      description: `${member.user} (${member.user.tag})`,
      thumbnail: { url: member.displayAvatarURL() },
      footer: { text: `ID: ${member.id}` },
      timestamp: new Date().toISOString(),
    }]
  }).catch(() => {});
}