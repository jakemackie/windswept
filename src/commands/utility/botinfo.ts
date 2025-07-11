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
    .setDescription('Check the bot\'s info'),

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
      .setColor(client.color)
      .setTitle(`${user?.username ?? 'Bot'} info`)
      .setThumbnail(clientAvatarUrl)
      .addFields(
          { 
            name: 'Environment', 
            value: client.environment, 
            inline: false
          },
          { 
            name: 'Uptime', 
            value: uptimeValue, 
            inline: false 
          }
      );

    await interaction.reply({ embeds: [embed] });
  }
};
