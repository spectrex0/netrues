import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  ActivityType,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("set-bot-presence")
  .setDescription("Add a custom status")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addStringOption((option) =>
    option.setName("text").setDescription("Custom text").setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("type")
      .setDescription("Kind of activity")
      .setRequired(true)
      .addChoices(
        { name: "Playing", value: "PLAYING" },
        { name: "Streaming", value: "STREAMING" },
        { name: "Listening", value: "LISTENING" },
        { name: "watching", value: "WATCHING" },
        { name: "Competing", value: "COMPETING" },
      ),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.inCachedGuild()) return;

  const text = interaction.options.getString("text", true);
  const typeValue = interaction.options.getString(
    "type",
    true,
  ) as keyof typeof ActivityType;
  const type = ActivityType[typeValue];

  await interaction.deferReply({ ephemeral: true });

  try {
    interaction.client.user.setPresence({
      activities: [{ name: text, type }],
      status: "online",
    });
    await interaction.editReply(
      `Changed to: **${typeValue.toLowerCase()} ${text}**.`,
    );
  } catch (error) {
    console.error("[SET-PRESENCE] Error:", error);
    await interaction.editReply("Sorry, something went wrong");
  }
}
