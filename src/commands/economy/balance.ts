import { 
	SlashCommandBuilder,
	EmbedBuilder,
	MessageFlags
} from 'discord.js';

import type { 
	ChatInputCommandInteraction
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
      // Find or create the user's economy record
      let economy = await prisma.economy.findUnique({ where: { userId: user.id } });
      if (!economy) {
        economy = await prisma.economy.create({ data: { userId: user.id } });
      }

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`💰 ${user}: Your balance is **${economy.balance}**`);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);

      const errorEmbed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription('Failed to fetch your balance. Please try again.');

      await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
    }
  },
};
