import { Message } from 'discord.js';
import netrues from '../../index.js';
import axios from 'axios';

export default () => {
  netrues.on('messageCreate', async (message: Message) => {
    if (!message.guild || message.author.bot) return;

    if (message.content.trim() === '-cat') {
      try {
        const response = await axios.get('https://api.thecatapi.com/v1/images/search?limit=1', {
          headers: {
            Accept: 'application/json',
          },
        });

        const catImageUrl = response.data[0]?.url;
        if (!catImageUrl) {
          throw new Error('No image URL found in the API response.');
        }

        await message.reply(catImageUrl);
      } catch (error: any) {
        console.error('Error fetching cat image:', error.message);
        if (error.response) {
          console.error('API Response Status:', error.response.status);
          console.error('API Response Data:', error.response.data);
        }
        await message.reply('😿 Failed to fetch a cat image. Try again later!');
      }
    }
  });
};