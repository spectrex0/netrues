import { Message, EmbedBuilder } from 'discord.js';
import netrues from '../../index.js';
import axios from 'axios';

export default () => {
  netrues.on('messageCreate', async (message: Message) => {
    if (!message.guild || message.author.bot) return;

    if (message.content.trim() === '-meme') {
      try {
        const response = await axios.get('https://meme-api.com/gimme', {
          headers: {
            Accept: 'application/json',
          },
        });

        const data = response.data;

        const embed = new EmbedBuilder()
          .setTitle(data.title)
          .setURL(data.postLink)
          .setImage(data.url)
          .setColor('#FF4500')
          .setFooter({ text: `r/${data.subreddit} • 👍 ${data.ups}` });

        await message.reply({ embeds: [embed] });
      } catch (error: any) {
        console.error('Error fetching meme:', error.message);
        await message.reply('😂 Failed to fetch a meme. Try again later!');
      }
    }
  });
};