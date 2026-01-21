 

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Bans a member from the server.')
  .addUserOption(option =>
    option.setName('target')
      .setDescription('The member to ban')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('reason')
      .setDescription('Reason for the ban')
      .setRequired(false));

export async function execute(interaction: any) {
  const target = interaction.options.getUser('target');
  const member = await interaction.guild.members.fetch(target.id).catch(() => null);
  const reason = interaction.options.getString('reason') || 'No reason provided';

  if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
    return interaction.reply({ content: '❌ You do not have permission to ban members.', ephemeral: true });
  }

  if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
    return interaction.reply({ content: '❌ I do not have permission to ban members.', ephemeral: true });
  }

  if (!member) {
    return interaction.reply({ content: '❌ That user is not in this server.', ephemeral: true });
  }

  if (target.id === interaction.user.id) {
    return interaction.reply({ content: '❌ You cannot ban yourself.', ephemeral: true });
  }

  if (target.id === interaction.guild.ownerId) {
    return interaction.reply({ content: '❌ You cannot ban the server owner.', ephemeral: true });
  }

  if (member.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
    return interaction.reply({ content: '❌ You cannot ban someone with equal or higher role than you.', ephemeral: true });
  }

  if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
    return interaction.reply({ content: '❌ I cannot ban someone with equal or higher role than me.', ephemeral: true });
  }

  try {
    await member.ban({ reason });
    await interaction.reply(`✅ ${target.tag} has been banned. Reason: \`${reason}\``);
  } catch (error) {
    console.error('Ban failed:', error);
    await interaction.reply({ content: '❌ Failed to ban the user. They may be too powerful or protected.', ephemeral: true });
  }
}