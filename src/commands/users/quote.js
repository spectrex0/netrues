import axios from "axios";
import netrues from "../../index.ts";
export default () => {
    netrues.on('messageCreate', async (Message) => {
        if (Message.content === '-quote') {
            try {
                const rpd = await axios.get('https://zenquotes.io/api/random');
                const quoteData = rpd.data[0];
                await Message.channel.send(`"${quoteData.q}" — ${quoteData.a}`);
                await console.log(quoteData);
            }
            catch (error) {
                console.log(error);
            }
        }
    });
};
//# sourceMappingURL=quote.js.map