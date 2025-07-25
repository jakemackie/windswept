import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { windswept } from '../client/windswept.js';
import { pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadCommands = async (client: windswept) => {
	const foldersPath = path.join(__dirname, '..', 'commands');
	const commandFolders = fs.readdirSync(foldersPath);

	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = (await import(pathToFileURL(filePath).href)).default;

			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
				console.log(`Loaded command: ${command.data.name}`);
			} else {
				console.error(`${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}
};
