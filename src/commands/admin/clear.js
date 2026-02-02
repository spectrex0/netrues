import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
export const data = new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Deletes all messages in the current channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);
export async function execute(interaction) {
    if (!interaction.inCachedGuild())
        return;
    await interaction.deferReply({ ephemeral: true });
    try {
        let fetched;
        let totalDeleted = 0;
        do {
            const messages = await interaction.channel.messages.fetch({ limit: 100 });
            fetched = messages.size;
            if (fetched === 0)
                break;
            // Filtrar mensajes que no se pueden borrar (más de 14 días)
            const deletable = messages.filter(msg => {
                const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
                return msg.createdAt.getTime() > twoWeeksAgo;
            });
            if (deletable.size > 0) {
                await interaction.channel.bulkDelete(deletable, true);
                totalDeleted += deletable.size;
            }
        } while (fetched === 100);
        await interaction.editReply(`✅ Successfully deleted ${totalDeleted} messages.`);
    }
    catch (error) {
        console.error('[CLEAR] Error:', error);
        await interaction.editReply('❌ Failed to delete messages. Make sure I have permission and the messages are not older than 14 days.');
    }
}
//# sourceMappingURL=clear.js.map