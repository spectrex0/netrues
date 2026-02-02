import axios from 'axios';
export default function registerFactCommand(client) {
    client.on('messageCreate', async (message) => {
        if (message.author.bot || !message.guild)
            return;
        if (message.content.trim() === '-fact') {
            try {
                const response = await axios.get('https://api.api-ninjas.com/v1/facts', {
                    headers: {
                        'X-Api-Key': 'R/BNM/gaVQPN79RKwAHdrg==FSV2Vgy8WjLMvJo8',
                    },
                });
                if (!Array.isArray(response.data) || response.data.length === 0) {
                    throw new Error('API returned no facts');
                }
                const factData = response.data[0];
                if (typeof factData?.fact !== 'string' || factData.fact.trim() === '') {
                    throw new Error('Invalid or empty fact received');
                }
                await message.reply(`**"${factData.fact}"**`);
            }
            catch (error) {
                console.error('[FACT] Error:', error.message || error);
                if (error.response) {
                    console.error('[FACT] API Status:', error.response.status);
                    console.error('[FACT] API Response:', error.response.data);
                }
                await message.reply('😿 Failed to fetch a fact. Try again later!');
            }
        }
    });
}
//# sourceMappingURL=randomFact.js.map