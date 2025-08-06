import { 
	SlashCommandBuilder,
	MessageFlags,
	type ChatInputCommandInteraction 
} from 'discord.js';

import db from '../../database/db.js';

export default {
	name: 'balance',
	data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your balance'),

	async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.user;

    try {
      const economyData = await db.economy.upsert({
        where: { userId: user.id },
        create: { userId: user.id, balance: 0 },
        update: { balance: { increment: 0 } }
      });

      await interaction.reply(`Your balance is **${economyData.balance}**`);
    } catch (error) {
      console.error(error);

      await interaction.reply({ 
        content: 'Failed to retrieve balance. Please try again.', 
        flags: MessageFlags.Ephemeral 
      });
    }
  }
};
