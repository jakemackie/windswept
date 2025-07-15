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
	name: 'afk',
	data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Set your AFK status')
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for being AFK')
        .setRequired(false)
    ),

	async execute(interaction: ChatInputCommandInteraction) {
		const client = interaction.client as windswept;
    const user = interaction.user;

    const reason = interaction.options.getString('reason') ?? null;

		const embed = new EmbedBuilder()
			.setColor(client.color)
			.setDescription(`:dash: ${user}: You're now AFK${reason ? `: **${reason}**` : ''}`);

    try {
      await prisma.afk.upsert({
        where: { userId: user.id },
        create: { userId: user.id, reason },
        update: { reason }
      });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);

      const errorEmbed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription('Failed to set AFK status. Please try again.');

      await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
    }
  },
};
