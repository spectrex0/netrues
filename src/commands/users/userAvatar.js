import { SlashCommandBuilder } from 'discord.js';
const RESTRICTED_USER_ID = '852949329320345620';
export const data = new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get a user\'s avatar (or your own)')
    .addUserOption(option => option.setName('user')
    .setDescription('The user whose avatar you want to see')
    .setRequired(false));
export async function execute(interaction) {
    await interaction.deferReply();
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const isSelf = !interaction.options.getUser('user');
    if (targetUser.id === RESTRICTED_USER_ID) {
        return interaction.editReply("This user is my owner why should u have his profile pic?");
    }
    try {
        const avatarURL = targetUser.displayAvatarURL({ size: 1024 });
        if (!avatarURL || avatarURL.includes('null')) {
            throw new Error('No visible profile picture');
        }
        const message = isSelf
            ? "Your avatar:"
            : `Avatar of ${targetUser.username}:`;
        await interaction.editReply({ content: message, files: [{ attachment: avatarURL, name: 'avatar.png' }] });
    }
    catch (error) {
        console.error('[UA] Error fetching avatar:', error);
        await interaction.editReply("Oops! Something went wrong while fetching the profile picture.");
    }
}
//# sourceMappingURL=userAvatar.js.map