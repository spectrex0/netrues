// commands/jail.ts
import { SlashCommandBuilder, PermissionFlagsBits, } from 'discord.js';
export const data = new SlashCommandBuilder()
    .setName('jail')
    .setDescription('Send a user to jail by removing their roles and assigning the Jail role.')
    .addUserOption(option => option.setName('user')
    .setDescription('The user to jail')
    .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);
export async function execute(interaction) {
    if (!interaction.inCachedGuild())
        return;
    const targetUser = interaction.options.getUser('user', true);
    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    if (!member) {
        return interaction.reply({ content: '❌ That user is not in this server.', ephemeral: true });
    }
    if (!interaction.guild.members.me?.permissions.has(PermissionFlagsBits.ManageRoles)) {
        return interaction.reply({ content: '❌ I don’t have permission to manage roles.', ephemeral: true });
    }
    const jailRole = interaction.guild.roles.cache.find(role => role.name.toLowerCase() === 'jail');
    if (!jailRole) {
        return interaction.reply({
            content: '❌ The `Jail` role does not exist. Please create a role named **Jail** first.',
            ephemeral: true,
        });
    }
    if (member.id === interaction.user.id) {
        return interaction.reply({ content: '❌ You cannot jail yourself.', ephemeral: true });
    }
    if (member.id === interaction.guild.ownerId) {
        return interaction.reply({ content: '❌ You cannot jail the server owner.', ephemeral: true });
    }
    if (member.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
        return interaction.reply({ content: '❌ You cannot jail someone with equal or higher role than you.', ephemeral: true });
    }
    if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
        return interaction.reply({ content: '❌ I cannot jail someone with equal or higher role than me.', ephemeral: true });
    }
    await interaction.deferReply({ ephemeral: true });
    try {
        const rolesToKeep = [jailRole.id, interaction.guild.id];
        const rolesToRemove = member.roles.cache.filter(role => !rolesToKeep.includes(role.id));
        await member.roles.remove(rolesToRemove);
        await member.roles.add(jailRole);
        await interaction.editReply(`✅ ${member.user.tag} has been jailed by ${interaction.user.tag}.`);
    }
    catch (error) {
        console.error('[JAIL] Error:', error);
        await interaction.editReply('❌ Failed to jail the user. Check role hierarchy or permissions.');
    }
}
//# sourceMappingURL=jail.js.map