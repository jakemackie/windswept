import { 
  SlashCommandBuilder,
  EmbedBuilder
} from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import { windswept } from '../../client/windswept.js';

export default {
  name: 'botinfo',
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Check the bot\'s latency'),

  async execute(interaction: CommandInteraction) {
    const client = interaction.client as windswept;
    const user = client.user;
    const clientAvatarUrl = user?.displayAvatarURL({ size: 1024 }) ?? '';

    // Get ready timestamp in seconds for Discord's <t:...:R> format
    const readyTimestamp = client.readyTimestamp
      ? Math.floor(client.readyTimestamp / 1000)
      : null;
    const uptimeValue = readyTimestamp
      ? `<t:${readyTimestamp}:R>`
      : 'Not ready';

    const embed = new EmbedBuilder()
      .setColor(0xd4c0bf)
      .setTitle(`${user?.username ?? 'Bot'} info`)
      .setThumbnail(clientAvatarUrl)
      .addFields(
          { name: 'Uptime', value: uptimeValue }
      );

    await interaction.reply({ embeds: [embed] });
  }
};
