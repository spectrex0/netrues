import { log } from "console";
import { ActivityType, Client, Collection, GatewayIntentBits, REST, Routes, } from "discord.js";
import dotenv from "dotenv";
import { readdir, readFile } from "fs/promises";
import path, { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import ask from "./ask.ts";
import { systemPrompt } from "./prompt.ts";
import { Groq } from "groq-sdk";
import catImage from "./commands/users/catImage.ts";
import registerFactCommand from "./commands/users/randomFact.ts";
import helpCommand from "./commands/users/helpCommand.ts";
import quote from "./commands/users/quote.ts";
import meme from "./commands/users/meme.ts";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();
export const netrues = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});
netrues.commands = new Collection();
const SCAM_RULES_PATH = join(__dirname, "scamPatterns.json");
const MIN_SCAM_LENGTH = 15;
const scamCache = new Map();
const jailRoles = new Map();
let scamRules = [];
const groq = new Groq({ apiKey: process.env.GROQ_API });
(async () => {
    try {
        const raw = await readFile(SCAM_RULES_PATH, "utf-8");
        scamRules = JSON.parse(raw);
    }
    catch (err) {
        console.error("[INIT] Failed loading scam rules", err);
    }
})();
async function isScam(message) {
    if (scamCache.has(message))
        return scamCache.get(message);
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt.trim() },
                { role: "user", content: message.trim() },
            ],
            model: "qwen/qwen3-32b",
            temperature: 0,
            max_tokens: 10,
            top_p: 1,
        });
        const reply = chatCompletion.choices[0]?.message?.content?.trim() || "";
        const result = reply.toUpperCase() === "YES";
        scamCache.set(message, result);
        return result;
    }
    catch (err) {
        console.error("[isScam]", err);
        return false;
    }
}
async function loadGuildEvents() {
    const eventsPath = join(__dirname, "events", "guild");
    const eventFiles = (await readdir(eventsPath)).filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
    for (const file of eventFiles) {
        const filePath = join(eventsPath, file);
        const event = await import(`file://${filePath}`);
        if (event.name && typeof event.execute === "function") {
            if (event.once) {
                netrues.once(event.name, (...args) => event.execute(...args));
            }
            else {
                netrues.on(event.name, (...args) => event.execute(...args));
            }
            log(`[EVENTS] Loaded guild event: ${event.name}`);
        }
    }
}
function aiBrain() {
    const userMessageHistory = new Map();
    const userLastWarning = new Map();
    netrues.on("messageCreate", async (message) => {
        if (message.author.bot || !message.guild)
            return;
        const { content, author, guild, channel } = message;
        const now = Date.now();
        const history = userMessageHistory.get(author.id) || [];
        const recent = history.filter((h) => now - h.time < 10_000);
        recent.push({ content, time: now });
        userMessageHistory.set(author.id, recent);
        if (recent.length > 4) {
            await message.delete().catch(() => { });
            const lastWarn = userLastWarning.get(author.id) || 0;
            if (now - lastWarn > 30_000) {
                userLastWarning.set(author.id, now);
                await channel.send({
                    content: `${author}, please slow down! Sending too many messages too quickly.`,
                    allowedMentions: { users: [author.id] },
                }).then(msg => setTimeout(() => msg.delete().catch(() => { }), 5000)).catch(() => { });
            }
            return;
        }
        const isDuplicate = recent.length >= 2 &&
            recent.slice(0, -1).some(h => content.trim().toLowerCase() === h.content.trim().toLowerCase());
        if (isDuplicate) {
            await message.delete().catch(() => { });
            return;
        }
        if (content.length >= MIN_SCAM_LENGTH) {
            let isScamContent = scamRules.some((rule) => new RegExp(rule.pattern, "i").test(content));
            if (!isScamContent) {
                isScamContent = await isScam(content);
            }
            if (isScamContent) {
                await message.react("⚠️");
                await message.delete().catch(() => { });
                return jailUser(guild, author.id);
            }
        }
    });
}
async function jailUser(guild, userId) {
    let jailRoleId = jailRoles.get(guild.id);
    let jailRole = jailRoleId
        ? guild.roles.cache.get(jailRoleId)
        : guild.roles.cache.find((r) => r.name === "Jail");
    if (!jailRole) {
        jailRole = await guild.roles.create({
            name: "Jail",
            reason: "Scam Detection",
            permissions: [],
        });
        jailRoles.set(guild.id, jailRole.id);
    }
    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member)
        return;
    try {
        await member.roles.set([jailRole]);
    }
    catch (err) {
        console.error("[jailUser] Failed to assign jail role", err);
    }
}
async function getCommandFiles(dir) {
    const dirents = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = join(dir, dirent.name);
        return dirent.isDirectory()
            ? getCommandFiles(res)
            : Promise.resolve([res]);
    }));
    return files.flat();
}
async function deployCommands() {
    const commandsPath = join(__dirname, "commands/admin");
    let commandFiles;
    try {
        commandFiles = await getCommandFiles(commandsPath);
    }
    catch (err) {
        console.warn(`[COMMANDS] Commands directory not found: ${commandsPath}`);
        return;
    }
    commandFiles = commandFiles.filter((file) => file.endsWith(".ts") && !file.endsWith(".d.ts"));
    if (commandFiles.length === 0) {
        log("[COMMANDS] No .ts command files found in commands directory.");
        return;
    }
    const commandsData = [];
    for (const filePath of commandFiles) {
        try {
            const fileUrl = pathToFileURL(filePath).href;
            const commandModule = await import(fileUrl);
            const command = commandModule.default || commandModule;
            if (!command?.data || typeof command.execute !== "function") {
                log(`[COMMANDS] Skipped invalid command: ${filePath}`);
                continue;
            }
            netrues.commands.set(command.data.name, command);
            commandsData.push(command.data.toJSON());
            const relativePath = filePath.replace(join(__dirname, "commands") + path.sep, "");
            log(`[COMMANDS] Loaded: ${command.data.name} (${relativePath})`);
        }
        catch (err) {
            console.error(`[COMMANDS] Failed to load ${filePath}:`, err);
        }
    }
    if (commandsData.length === 0) {
        log("[COMMANDS] No valid commands to register.");
        return;
    }
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
    try {
        log(`[COMMANDS] Registering ${commandsData.length} global command(s)...`);
        const data = (await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commandsData }));
        log(`[COMMANDS] Successfully registered ${data.length} global command(s).`);
    }
    catch (error) {
        console.error("[COMMANDS] Registration failed:", error);
    }
}
async function startBot() {
    aiBrain();
    ask();
    loadGuildEvents();
    netrues.once("clientReady", async () => {
        await deployCommands();
        netrues.user?.setStatus("dnd");
        netrues.user?.setActivity({
            name: "Netrues server",
            type: ActivityType.Watching,
        });
        registerFactCommand(netrues);
        helpCommand();
        catImage();
        quote();
        meme();
        log(`[ONLINE] Bot ready as ${netrues.user?.tag}`);
        log('');
        log(`[DEV] Bot under development :>`);
        log('');
    });
    netrues.on("interactionCreate", async (interaction) => {
        if (!interaction.isChatInputCommand())
            return;
        const command = netrues.commands.get(interaction.commandName);
        if (!command) {
            console.error(`[SLASH] No command matching ${interaction.commandName} was found.`);
            return;
        }
        try {
            log(`[SLASH] Executing /${interaction.commandName} by ${interaction.user.tag} in ${interaction.guild?.name || "DM"}`);
            await command.execute(interaction);
        }
        catch (error) {
            console.error(`[SLASH] Error executing /${interaction.commandName}:`, error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "❌ There was an error while executing this command!",
                    ephemeral: true,
                });
            }
            else {
                await interaction.reply({
                    content: "❌ There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        }
    });
    await netrues.login(process.env.TOKEN);
}
startBot();
export default netrues;
//# sourceMappingURL=index.js.map