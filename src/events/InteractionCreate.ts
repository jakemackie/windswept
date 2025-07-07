import { 
  Events, 
  MessageFlags,
  type Interaction 
} from 'discord.js';
import type { windswept } from '../client/windswept.js';

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const client = interaction.client as windswept;
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      return await interaction.reply({ 
        content: 'Command not found.', 
        flags: MessageFlags.Ephemeral 
      });
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ 
          content: 'There was an error executing this command.', 
          flags: MessageFlags.Ephemeral 
        });
      } else {
        await interaction.reply({ 
          content: 'There was an error executing this command.', 
          flags: MessageFlags.Ephemeral 
        });
      }
    }
  },
};
