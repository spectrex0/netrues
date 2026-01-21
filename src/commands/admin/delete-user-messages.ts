import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Message,
  ChannelType,
} from 'discord.js';

function canBulkDelete(channel: any): channel is 
  | import('discord.js').TextChannel
  | import('discord.js').NewsChannel
  | import('discord.js').ThreadChannel {
  return (
    channel &&
    'bulkDelete' in channel &&
    (channel.type === ChannelType.GuildText ||
     channel.type === ChannelType.GuildAnnouncement ||
     channel.isThread())
  );
}

export const data = new SlashCommandBuilder()
  .setName('delete-user-messages')
  .setDescription('Delete ALL recent messages from a specific user (up to 100) (last 14 days)')
  .addUserOption(option =>
    option
      .setName('user')
      .setDescription('The user whose messages to delete')
      .setRequired(false)
  )
  .addIntegerOption(option => 
    option
    .setName('user-id')
    .setDescription('if the user isnt on this server u can use his id')
    .setMaxValue(1)
    .setRequired(false)
  )
  .addIntegerOption(option =>
    option
      .setName('limit')
      .setDescription('Max messages to scan (1–100)')
      .setMinValue(1)
      .setMaxValue(100)
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({ content: '❌ This command only works in servers.', ephemeral: true });
    return;
  }

  if (!interaction.channel || !canBulkDelete(interaction.channel)) {
    await interaction.reply({ content: '❌ This command only works in server text channels.', ephemeral: true });
    return;
  }

  const targetUser = interaction.options.getUser('user', true)
  const targetUserID = interaction.options.getUser('user-id', true);
  const limit = interaction.options.getInteger('limit') ?? 50;

  await interaction.deferReply({ ephemeral: true });

  try {
    const messages = await interaction.channel.messages.fetch({ limit });
    const now = Date.now();
    const bulkDelete: Message[] = [];
    const singleDelete: Message[] = [];

    for (const msg of messages.values()) {
      if (msg.author.id !== targetUser.id) continue;
      if (now - msg.createdTimestamp < 1209600000) {
        bulkDelete.push(msg);
      } else {
        singleDelete.push(msg);
      }
    }

    let deletedCount = 0;

    if (bulkDelete.length > 0) {
      await interaction.channel.bulkDelete(bulkDelete, true);
      deletedCount += bulkDelete.length;
    }

    if (singleDelete.length > 0) {
      for (const msg of singleDelete) {
        try {
          await msg.delete();
          deletedCount++;
        } catch {}
      }
    }

    await interaction.editReply(
      deletedCount > 0
        ? `🗑️ Deleted **${deletedCount}** message(s) from ${targetUser.tag}.`
        : `No messages found from ${targetUser.tag} in the last ${limit} messages.`
    );
  } catch (error: any) {
    console.error('[DELETEUSER] Error:', error);
    if (error.code === 50013) {
      await interaction.editReply('🔐 I need **Manage Messages** and **Read Message History** permissions.');
    } else {
      await interaction.editReply('💥 Failed to delete messages. Try again or check permissions.');
    }
  }
}