import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on('messageCreate', (message) => {
  if (message.content === '!ping') {
    message.reply('Pong!');
  }
});

// Ensure the token is present (fail fast if not)
const token = process.env.DISCORD_TOKEN;
if (!token) {
  throw new Error('Missing DISCORD_TOKEN env var');
}

client.login(token);
