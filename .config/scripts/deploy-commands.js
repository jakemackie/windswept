import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllCommandFiles } from '../dist/utils/getAllCommandFiles.js';
import { importCommands } from '../dist/utils/importCommands.js';
import { filterTopLevelCommands } from '../dist/utils/filterTopLevelCommands.js';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.TEST_GUILD_ID;

if (!token || !clientId || !guildId) {
  throw new Error('Missing DISCORD_TOKEN, DISCORD_CLIENT_ID, or TEST_GUILD_ID in environment.');
}

(async () => {
  const commandsPath = path.join(__dirname, '../dist/commands');

  const allCommandFiles = getAllCommandFiles(commandsPath);

  const topLevelCommandFiles = filterTopLevelCommands(allCommandFiles, commandsPath);

  const commands = await importCommands(topLevelCommandFiles);

  const commandsData = commands.map(cmd =>
    typeof cmd.data.toJSON === 'function' ? cmd.data.toJSON() : cmd.data
  );

  const rest = new REST({ version: '10' }).setToken(token);

  try {
    console.log('Deleting all existing application (/) commands...');
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: [] }
    );
    console.log('Successfully deleted all existing commands.');

    console.log(`Started refreshing ${commandsData.length} application (/) commands for guild ${guildId}.`);
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commandsData }
    );
    console.log('Successfully reloaded guild application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
