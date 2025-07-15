import { SlashCommandBuilder, EmbedBuilder, MessageFlags, PermissionsBitField, type GuildTextBasedChannel } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { windswept } from '../../client/windswept.js';

export default {
  name: 'firstmessage',
  data: new SlashCommandBuilder()
    .setName('firstmessage')
    .setDescription('Shows the first message in this server.'),

  async execute(interaction: ChatInputCommandInteraction) {
    // Resolve the client & interaction user
    const client = interaction.client as windswept;
    const interactionUser = interaction.user;

    if (!interaction.guild || !interaction.channel) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription('This command can only be used in a server.');
      return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }

    if (!interaction.channel.isTextBased() || !('messages' in interaction.channel)) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription('This command can only be used in text channels.');
      return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }

    // Only allow users with ViewChannel permission (if channel is a guild text channel)
    const member = interaction.guild.members.resolve(interaction.user.id);
    if (!member) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription('Something went wrong resolving your membership.');
      return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }

    // Type guard for GuildTextBasedChannel
    const channel = interaction.channel as GuildTextBasedChannel;
    if ('permissionsFor' in channel && !member.permissionsIn(channel).has(PermissionsBitField.Flags.ViewChannel)) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`${interactionUser} You do not have permission to view this channel.`);
      return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }

    // Fetch the first message in the channel
    let firstMessage;

    try {
      const messages = await channel.messages.fetch({ after: '1', limit: 1 });
      firstMessage = messages.first();
    } catch {
      firstMessage = undefined;
    }

    if (!firstMessage) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription('Could not find the first message in this channel.');
      return await interaction.reply({ embeds: [embed] });
    }

    const messageUrl = `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${firstMessage.id}`;
    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: firstMessage.author.username, iconURL: firstMessage.author.displayAvatarURL() })
      .addFields([
        { name: 'Author', value: `${firstMessage.author}`, inline: true },
        { name: 'Timestamp', value: `<t:${Math.floor(firstMessage.createdTimestamp / 1000)}:F>`, inline: true },
        { name: 'Message Link', value: messageUrl, inline: true },
      ]);

    return await interaction.reply({ embeds: [embed] });
  },
};
