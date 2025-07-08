import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { prisma } from '../../lib/prisma.js';

export default {
  name: 'record',
  data: new SlashCommandBuilder()
    .setName('record')
    .setDescription('Get or update your record')
    .addStringOption(option =>
      option
        .setName('text')
        .setDescription('Text to update your record with')
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const userId = interaction.user.id;
    const newText = interaction.options.getString('text');

    if (!newText) {
      // Just fetch and show the user's record
      const record = await prisma.record.findUnique({ where: { user_id: userId } });
      if (!record) {
        await interaction.reply("You don't have a record yet.");
      } else {
        await interaction.reply(`Your record: ${record.text || '(empty)'}`);
      }
      return;
    }

    // Update or create the user's record
    const record = await prisma.record.upsert({
      where: { user_id: userId },
      update: { text: newText },
      create: { user_id: userId, text: newText },
    });

    await interaction.reply(`Your record has been updated to: ${record.text}`);
  }
};
