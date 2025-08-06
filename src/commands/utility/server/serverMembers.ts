import {
  EmbedBuilder,
  MessageFlags,
  type ChatInputCommandInteraction
} from 'discord.js';

import { windswept } from '@/client/windswept';

export default {
  data: {
    name: 'members',
    description: 'Fetch the server\'s member count'
  },
  async execute(interaction: ChatInputCommandInteraction) {
    const client = interaction.client as windswept;
    const guild = interaction.guild;

    if (!guild) {
      return interaction.reply({
        content: 'This command can only be used in a server.',
        flags: MessageFlags.Ephemeral
      });
    }

    const color = await client.getGuildColor(guild);

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(`${guild.name} Member Count`)
      .setThumbnail(guild.iconURL() || '')
      .addFields([
        {
          name: 'Total',
          value: `${guild.memberCount}`,
          inline: true
        },
        {
          name: 'Members',
          value: `${guild.members.cache.filter(member => !member.user.bot).size}`,
          inline: true
        },
        {
          name: 'Bots',
          value: `${guild.members.cache.filter(member => member.user.bot).size}`,
          inline: true
        }
      ]);

    await interaction.reply({
      embeds: [embed],
    });
  }
};
