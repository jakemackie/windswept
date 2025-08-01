import { 
	SlashCommandBuilder,
	EmbedBuilder,
	MessageFlags,
	type ChatInputCommandInteraction 
} from 'discord.js';

import { windswept } from '../../client/windswept.js';
import prisma from '../../lib/prisma.js';

export default {
	name: 'balance',
	data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your balance'),

	async execute(interaction: ChatInputCommandInteraction) {
		const client = interaction.client as windswept;
    const user = interaction.user;

    try {
      const economyData = await prisma.economy.upsert({
        where: { userId: user.id },
        create: { userId: user.id, balance: 0 },
        update: { balance: { increment: 0 } }
      });

      await interaction.reply(`Your balance is: ${economyData.balance}`);
    } catch (error) {
      console.error(error);

      const errorEmbed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription('Failed to set AFK status. Please try again.');

      await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
    }
  },
};
  