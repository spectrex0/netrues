import { netrues } from "./index.ts";
import { systemPrompt } from "./prompt.ts";
import { Groq } from 'groq-sdk';
import 'dotenv/config';
const MIN_PROMPT_LENGTH = 1;
const COOLDOWN_MS = 5000;
const MAX_MEMORY_MESSAGES = 99999999;
const userCooldown = new Map();
const conversationMemory = new Map();
const groq = new Groq({ apiKey: process.env.GROQ_API });
export default function ask() {
    netrues.on("messageCreate", async (message) => {
        if (message.author.bot)
            return;
        const botId = netrues.user?.id;
        if (!botId)
            return;
        const isMentioned = message.mentions.users.has(botId);
        let isRepliedToBot = false;
        if (message.reference?.messageId) {
            try {
                const ref = await message.channel.messages.fetch(message.reference.messageId);
                isRepliedToBot = ref.author.id === botId;
            }
            catch { }
        }
        if (!isMentioned && !isRepliedToBot) {
            const channelId = message.channel.id;
            if (conversationMemory.has(channelId)) {
                const mem = conversationMemory.get(channelId);
                mem.push({ role: 'user', content: message.content.trim() });
                if (mem.length > MAX_MEMORY_MESSAGES) {
                    mem.shift();
                }
            }
            return;
        }
        const now = Date.now();
        const expire = userCooldown.get(message.author.id);
        if (expire && now < expire) {
            const wait = Math.ceil((expire - now) / 1000);
            await message.reply(`⏳ wait ${wait}s`);
            return;
        }
        userCooldown.set(message.author.id, now + COOLDOWN_MS);
        let prompt = isMentioned
            ? message.content.replace(new RegExp(`<@!?${botId}>`, "g"), "").trim()
            : message.content.trim();
        if (prompt.length < MIN_PROMPT_LENGTH) {
            await message.reply("say something.");
            return;
        }
        const channelId = message.channel.id;
        let messagesHistory = conversationMemory.get(channelId) ?? [];
        try {
            await message.channel.sendTyping();
            const messages = [
                { role: "system", content: systemPrompt },
                ...messagesHistory,
                { role: "user", content: prompt }
            ];
            const chatCompletion = await groq.chat.completions.create({
                messages,
                model: "openai/gpt-oss-120b",
                temperature: 0.7,
                max_tokens: 1000,
                top_p: 0.9,
                stream: false
            });
            const text = chatCompletion.choices[0]?.message?.content?.trim();
            if (!text) {
                await message.reply("no response.");
                return;
            }
            messagesHistory.push({ role: 'user', content: prompt });
            messagesHistory.push({ role: 'assistant', content: text });
            if (messagesHistory.length > MAX_MEMORY_MESSAGES) {
                messagesHistory = messagesHistory.slice(-MAX_MEMORY_MESSAGES);
            }
            conversationMemory.set(channelId, messagesHistory);
            const reply = text.length > 1990 ? text.slice(0, 1987) + "..." : text;
            await message.reply(reply);
        }
        catch (err) {
            console.error("Api error:", err);
            await message.reply("something broke.");
        }
    });
}
//# sourceMappingURL=ask.js.map