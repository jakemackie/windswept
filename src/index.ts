import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { loadEvents } from './hooks/event.js';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

await loadEvents(client);

// Ensure the token is present (fail fast if not)
const token = process.env.DISCORD_TOKEN;
if (!token) {
  throw new Error('Missing DISCORD_TOKEN env var');
}

client.login(token);
