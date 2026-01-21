import { EmbedBuilder } from 'discord.js';
import netrues from '../../index.ts';

export default () => {
  netrues.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    if (message.content.trim() === '-help') {
      try {
        const helpEmbed = new EmbedBuilder()
          .setColor('#00FFFF')
          .setTitle('List of Available Commands')
          .setDescription('Here is a list of commands you can use:')
          .addFields(
            { name: '`/avatar`', value: 'Gets the avatar of a user.', inline: true },
            { name: '`-cat`', value: 'Shows random cat images.', inline: true },
            { name: '`-fact`', value: 'Sends an interesting fact.', inline: true },
          )
          .setFooter({ text: 'For more information or ideas, contact the bot administrator.' })
          .setTimestamp();

        await message.channel.send({ embeds: [helpEmbed] });
      } catch (error) {
        console.error('[HELP] Error sending embed:', error);
      }
    }
  });
};