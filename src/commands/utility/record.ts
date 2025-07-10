import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import prisma from '../../lib/prisma.js';

export default {
  name: 'record',
  data: new SlashCommandBuilder()
    .setName('record')
    .setDescription('Save or fetch your personal record')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Text to save as your record')
        .setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const userId = interaction.user.id;
    const text = interaction.options.getString('text');
    const existing = await prisma.record.findFirst({ where: { userId } });

    if (!existing && !text) {
      await interaction.reply({ content: 'You have no saved record.' });
      return;
    }

    if (text) {
      if (existing) {
        await prisma.record.update({
          where: { id: existing.id },
          data: { text },
        });
      } else {
        await prisma.record.create({
          data: { userId, text },
        });
      }
      await interaction.reply({ content: 'Your record has been saved!' });
    } else {
      await interaction.reply({ content: `Your record: ${existing!.text}` });
    }
  }
};
