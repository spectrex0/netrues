import { SlashCommandBuilder } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
export const data = new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Displays a list of available admin commands.');
export async function execute(interaction) {
    const helpEmbed = new EmbedBuilder()
        .setColor('#00FFFF')
        .setTitle('List of Available Admin Commands')
        .setDescription('Here is a list of commands you can use:')
        .addFields({ name: '`/jail`', value: 'Send a member to jail', inline: true }, { name: '`/kick`', value: 'Kick a member from the server', inline: true }, { name: '`/ban`', value: 'Ban a member from the server', inline: true }, { name: '`/clear`', value: 'Delete up to 100 messages in this channel', inline: true }, { name: '`/set-bot-presence`', value: 'Set Custom status', inline: true })
        .setFooter({ text: 'For support or suggestions, contact the bot owner.' })
        .setTimestamp();
    await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
}
//# sourceMappingURL=adminCommands.js.map