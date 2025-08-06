import { 
	SlashCommandBuilder,
	MessageFlags,
	type ChatInputCommandInteraction 
} from 'discord.js';

import db from '../../database/db.js';

export default {
	name: 'daily',
	data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily reward (resets every 24 hours)'),

	async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.user;

    try {
      const userEconomy = await db.economy.findUnique({
        where: { userId: user.id }
      });

      // Check if the user has already claimed their daily reward
      if (userEconomy && userEconomy.lastDailyRewardClaimed) {
        const lastClaimed = new Date(userEconomy.lastDailyRewardClaimed);
        const now = new Date();

        if (now.getTime() - lastClaimed.getTime() < 24 * 60 * 60 * 1000) {
          return await interaction.reply(`You've already claimed your daily reward. You can claim again <t:${Math.floor((lastClaimed.getTime() + 24 * 60 * 60 * 1000) / 1000)}:R>.`);
        }
      }

      // Between 500 and 1000
      const amountToReward = Math.floor(Math.random() * 1000) + 500;

      // Update the user's balance and last daily reward claimed time
      await db.economy.upsert({
        where: { userId: user.id },
        create: { userId: user.id, balance: amountToReward, lastDailyRewardClaimed: new Date() },
        update: { balance: { increment: amountToReward }, lastDailyRewardClaimed: new Date() }
      });

      await interaction.reply(`Claimed your daily reward of **${amountToReward}** coins!`);
      
    } catch (error) {
      console.error(error);

      await interaction.reply({ 
        content: 'An error occurred while claiming your daily reward. Please try again later.', 
        flags: MessageFlags.Ephemeral 
      });
    }
  }
};
