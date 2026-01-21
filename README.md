# 🌴 Netrues Bot

> *A smart, AI-powered Discord bot built with care by [dev0_tokyo](https://discord.com/users/852949329320345620)*  
> Friendly • Intelligent • Customizable • 100% hand-coded

---

## 🤖 Features

- **AI-Powered Brain**: Uses Groq + Qwen to detect scams, analyze messages, and stay alert.
- **Anti-Scam Shield**: Real-time detection of phishing, fake nitro, and malicious links.
- **User-Friendly Commands**: Fun, utility, and moderation tools in one place.
- **Fully Customizable**: Edit the AI’s behavior via `prompt.ts` — make it kinder, stricter, or funnier!
- **Lightweight & Fast**: Built with TypeScript, Discord.js v14, and modern async patterns.

---

## 📜 Commands

### 👥 Public Commands
| Command | Description |
|--------|-------------|
| `-help` | Show this help menu |
| `-cat` | 🐱 Get a random cat image |
| `-fact` | 💡 Learn a random interesting fact |
| `/avatar` | 🖼️ Fetch any user’s avatar |

### 🔒 Admin Commands
| Command | Description |
|--------|-------------|
| `/jail` | Lock a user in the "Jail" role |
| `/clear` | Bulk-delete up to 100 messages |
| `/kick` | Remove a user from the server |
| `/ban` | Ban a user permanently |
| `/set-bot-presence` | Change the bot’s custom status (e.g., “Watching Netrues server”) |

> 💡 **Tip**: The bot auto-creates a `Jail` role if it doesn’t exist!

---

## 🧠 AI Behavior

Netrues has an **AI brain** that learns from its environment — but it’s not magic!  
You can tweak how it thinks by editing:

```
src/prompt.ts
```

Make it more cautious, playful, or strict. Just remember:  
> *“Be kind — don’t make him hate you.”* 😼

---

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Framework**: Discord.js v14
- **AI Backend**: Groq + Qwen 32B (`qwen/qwen3-32b`)
- **Database**: None (stateless for now — all config in memory/files)
- **Security**: Scam patterns loaded from `scamPatterns.json`

---

## 👤 Developer

Made with ❤️ by **[dev0_tokyo](https://discord.com/users/852949329320345620)**  
aka *tokyo* — full-stack dev, bot creator.

 
---

## ⚠️ Disclaimer

This bot is **private-use only** unless explicitly shared by the author.  
© 2026 — All rights reserved. Not affiliated with Discord Inc.

---

## 🌐 Connect

- **Discord**: [dev0_tokyo](https://discord.com/users/852949329320345620)
---

✅ **Ready to run?** Just set your `.env` with `TOKEN`, `CLIENT_ID`, and `GROQ_API`, then `npm run dev`!

---
