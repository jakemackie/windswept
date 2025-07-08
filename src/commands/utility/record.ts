import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    if (text) {
      // Upsert the record
      await prisma.record.upsert({
        where: { userId },
        update: { text },
        create: { userId, text },
      });
      await interaction.reply({ content: 'Your record has been saved!' });
    } else {
      // Fetch the record
      const record = await prisma.record.findUnique({ where: { userId } });
      if (record?.text) {
        await interaction.reply({ content: `Your record: ${record.text}` });
      } else {
        await interaction.reply({ content: 'You have no saved record.' });
      }
    }
  }
};