import {
  Events,
  type Message, 
} from 'discord.js';
import type { windswept } from '../client/windswept.js';

const PREFIX = '~';

export default {
  name: Events.MessageCreate,
  async execute(message: Message) {
    // Ignore bots and DMs
    if (message.author.bot || !message) return;

    // Prefix command handling
    if (message.content.startsWith(PREFIX)) {
      const args = message.content.slice(PREFIX.length).trim().split(/ +/);
      const commandName = args.shift()?.toLowerCase();
      if (!commandName) return;

      const client = message.client as windswept;
      const command = client.commands.get(commandName);

      if (command && typeof command.prefix === 'function') {
        try {
          await command.prefix(message, args);
        } catch (error) {
          console.error(error);
          await message.reply('There was an error executing this command.');
        }
      }
      return;
    }

    // console.log(`${message.content}`);
  },
};
