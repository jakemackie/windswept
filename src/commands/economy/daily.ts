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

const DAILY_REWARD = 100;
const MS_IN_DAY = 24 * 60 * 60 * 1000;

export default {
	name: 'daily',
	data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily reward'),

	async execute(interaction: ChatInputCommandInteraction) {
		const client = interaction.client as windswept;
    const user = interaction.user;

    try {
      // Find or create the user's economy record
      let economy = await prisma.economy.findUnique({ where: { userId: user.id } });
      if (!economy) {
        economy = await prisma.economy.create({ data: { userId: user.id } });
      }

      const now = new Date();
      const lastClaim = economy.dailyRewardClaimedAt;
      let canClaim = false;
      let timeLeft = 0;
      if (!lastClaim) {
        canClaim = true;
      } else {
        const msSince = now.getTime() - new Date(lastClaim).getTime();
        if (msSince >= MS_IN_DAY) {
          canClaim = true;
        } else {
          timeLeft = MS_IN_DAY - msSince;
        }
      }

      if (canClaim) {
        const updated = await prisma.economy.update({
          where: { userId: user.id },
          data: {
            balance: { increment: DAILY_REWARD },
            dailyRewardClaimedAt: now
          }
        });
        const embed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(`🎁 ${user}: You claimed your daily reward of **${DAILY_REWARD}**!\nNew balance: **${updated.balance}**`);
        await interaction.reply({ embeds: [embed] });
      } else {
        // Calculate time left in hours/minutes/seconds
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        const timeString = `${hours}h ${minutes}m ${seconds}s`;
        const embed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(`⏳ ${user}: You already claimed your daily reward!\nCome back in **${timeString}**.`);
        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      }
    } catch (error) {
      console.error(error);
      const errorEmbed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription('Failed to claim your daily reward. Please try again.');
      await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
    }
  },
}; 