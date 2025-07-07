import { config } from 'dotenv';
import { windswept } from './types/Client.js';
import { loadEvents } from './hooks/event.js';
import { loadCommands } from './hooks/command.js';

config();

const client = new windswept();

await loadEvents(client);
await loadCommands(client);

// Ensure the token is present (fail fast if not)
const token = process.env.DISCORD_TOKEN;
if (!token) throw new Error('Missing DISCORD_TOKEN env var');

client.login(token);
