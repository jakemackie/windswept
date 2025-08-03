import { pathToFileURL } from 'url';
import type { Command } from '../types/Command.js';

export const importCommands = async (filePaths: string[]): Promise<Command[]> => {
  const commands: Command[] = [];
  for (const filePath of filePaths) {
    try {
      const mod = await import(pathToFileURL(filePath).href);
      const command: Command = mod.default;
      if (command && 'data' in command) {
        commands.push(command);
      } else {
        console.warn(`Command file ${filePath} does not export a valid command`);
      }
    } catch (error) {
      console.error(`Error importing command from ${filePath}: ${error}`);
    }
  }
  return commands;
};
