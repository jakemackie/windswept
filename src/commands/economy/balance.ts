import { 
	MessageFlags,
	type ChatInputCommandInteraction 
} from 'discord.js';

import type { CommandResult } from 'robo.js';

import db from '@/database/db.js';

export default async (interaction: ChatInputCommandInteraction): Promise<CommandResult> => {
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
};