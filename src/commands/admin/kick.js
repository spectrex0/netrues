import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
export const data = new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Bans a member from the server.')
    .addUserOption(option => option.setName('member')
    .setDescription('The member to kick')
    .setRequired(true))
    .addStringOption(option => option.setName('reason')
    .setDescription('Reason for the kick')
    .setRequired(false));
export async function execute(interaction) {
    const target = interaction.options.getUser('member');
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    const reason = interaction.options.getString('reason') || 'No reason provided';
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
        return interaction.reply({ content: 'You do not have permission to kick members.', ephemeral: true });
    }
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
        return interaction.reply({ content: 'I do not have permission to kick members.', ephemeral: true });
    }
    if (!member) {
        return interaction.reply({ content: 'That user is not in this server.', ephemeral: true });
    }
    if (target.id === interaction.user.id) {
        return interaction.reply({ content: 'You cannot kick yourself.', ephemeral: true });
    }
    if (target.id === interaction.guild.ownerId) {
        return interaction.reply({ content: 'You cannot kick the server owner.', ephemeral: true });
    }
    if (member.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
        return interaction.reply({ content: '❌ You cannot ban someone with equal or higher role than you.', ephemeral: true });
    }
    if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
        return interaction.reply({ content: '❌ I cannot ban someone with equal or higher role than me.', ephemeral: true });
    }
    try {
        await member.kick({ reason });
        await interaction.reply(`${target.tag} has been kicked. Reason: \`${reason}\``);
    }
    catch (error) {
        console.error('failed:', error);
        await interaction.reply({ content: 'Failed to kick the user. They may be too powerful or protected.', ephemeral: true });
    }
}
//# sourceMappingURL=kick.js.map