const axios = require('axios')
module.exports = (client) => {
    client.on('messageCreate', async (message) => {
    
        if (message.author.bot) return;
    
        if (message.content === '-quote') {
            try {
                const response = await axios.get('https://zenquotes.io/api/random', {
                });
                const quoteData = response.data[0];
                const quote = quoteData.q;
                const author = quoteData.a;
    
                const formattedMessage = `**"${quote}"**\n Author: ${author}`;
    
                message.channel.send(formattedMessage);
                console.log(formattedMessage)
            } catch (error) {
                console.error('Error sending quote :( :', error.message);
    
                message.channel.send('Something went wrong... Please check the logs');
            }
        }
    });
    
}