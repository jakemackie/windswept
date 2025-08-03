import path from 'path';
import { fileURLToPath } from 'url';
import { windswept } from '../client/windswept.js';
import { getAllCommandFiles } from '../utils/getAllCommandFiles.js';
import { filterTopLevelCommands } from '../utils/filterTopLevelCommands.js';
import { importCommands } from '../utils/importCommands.js';
import { logCommand } from '../utils/logCommand.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadCommands = async (client: windswept) => {
  const commandsPath = path.join(__dirname, '..', 'commands');
  const allCommandFiles = getAllCommandFiles(commandsPath);
  const commandFiles = filterTopLevelCommands(allCommandFiles, commandsPath);  
  
  try {
    const commands = await importCommands(commandFiles);

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      try {
        client.commands.set(command.data.name, command);
        logCommand(command);
      } catch (error) {
        console.error(`Error loading command ${command?.data?.name || 'unknown'}:`, error);
      }
    }
  } catch (error) {
    console.error('Error importing commands:', error);
  }
};
