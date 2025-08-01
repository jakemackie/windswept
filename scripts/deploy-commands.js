import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.TEST_GUILD_ID;

if (!token || !clientId || !guildId) {
  throw new Error('Missing DISCORD_TOKEN, DISCORD_CLIENT_ID, or TEST_GUILD_ID in environment.');
}

const commands = [];
const commandsPath = path.join(__dirname, '../dist/commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const commandModule = await import(pathToFileURL(filePath).href);
    const command = commandModule.default;
    if (command && command.data) {
      commands.push(command.data.toJSON());
    }
  }
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Deleting all existing application (/) commands...');
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: [] },
    );
    console.log('Successfully deleted all existing commands.');

    console.log(`Started refreshing ${commands.length} application (/) commands for guild ${guildId}.`);
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );
    console.log('Successfully reloaded guild application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
