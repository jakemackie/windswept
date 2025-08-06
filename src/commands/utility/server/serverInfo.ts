import {
  EmbedBuilder,
  MessageFlags,
  type ChatInputCommandInteraction
} from 'discord.js';

import type { APIEmbedField } from 'discord-api-types/v10';

import { windswept } from '@/client/windswept';

export default {
  data: {
    name: 'info',
    description: 'Fetch the server\'s information'
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
    const fields: APIEmbedField[] = [];

    const total = guild.memberCount;
    const members = guild.members.cache.filter(member => !member.user.bot).size;
    const bots = total - members;

    fields.push({
      name: 'Member Count',
      value: `**Total**: ${total}\n**Members**: ${members}\n**Bots**: ${bots}`,
      inline: true
    });

    const GUILD_TEXT = 0;
    const GUILD_ANNOUNCEMENT = 5;
    const GUILD_FORUM = 15;
    const GUILD_VOICE = 2;
    const GUILD_STAGE_VOICE = 13;

    const channelTypes = [
      { name: 'Text', type: GUILD_TEXT },
      { name: 'Announcement', type: GUILD_ANNOUNCEMENT },
      { name: 'Forum', type: GUILD_FORUM },
      { name: 'Voice', type: GUILD_VOICE },
      { name: 'Stage', type: GUILD_STAGE_VOICE }
    ];

    const allowedTypes = channelTypes.map(t => t.type);

    const totalChannels = guild.channels.cache.filter(
      channel => allowedTypes.includes(channel.type)
    ).size;

    const channelCounts = channelTypes
      .map(({ name, type }) => {
        const count = guild.channels.cache.filter(channel => channel.type === type).size;
        return count > 0 ? `**${name}**: ${count}` : null;
      })
      .filter(Boolean)
      .join('\n');

    if (channelCounts) {
      fields.push({
        name: `Channels (${totalChannels})`,
        value: channelCounts,
        inline: true
      });
    }

    const boostLevel = guild.premiumTier;
    
    let maxEmojis: number;

    switch (boostLevel) {
      case 3:
        maxEmojis = 250;
        break;
      case 2:
        maxEmojis = 150;
        break;
      case 1:
        maxEmojis = 100;
        break;
      default:
        maxEmojis = 50;
    }

    let maxStickers: number;

    switch (boostLevel) {
      case 3:
        maxStickers = 30;
        break;
      case 2:
        maxStickers = 15;
        break;
      case 1:
        maxStickers = 10;
        break;
      default:
        maxStickers = 5;
    }

    fields.push({
      name: 'Counts',
      value: `**Roles**: ${guild.roles.cache.size}/250\n**Emojis**: ${guild.emojis.cache.size}/${maxEmojis}\n**Stickers**: ${guild.stickers.cache.size}/${maxStickers}\n**Boosters**: ${guild.premiumSubscriptionCount || 0} (level ${boostLevel})`,
      inline: true
    });

    const owner = await guild.fetchOwner();

    fields.push({
      name: 'Owner',
      value: `${owner.user.username}`,
      inline: true
    });

    fields.push({
      name: 'Created',
      value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`,
      inline: true
    });

    const avatarUrl = guild.iconURL({ size: 512, extension: 'png' }) || '';
    const bannerUrl = guild.bannerURL({ size: 512, extension: 'png' }) || '';
    const splashUrl = guild.splashURL({ size: 512, extension: 'png' }) || '';

    const mediaLinks = [
      avatarUrl && `[Avatar](${avatarUrl})`,
      bannerUrl && `[Banner](${bannerUrl})`,
      splashUrl && `[Splash](${splashUrl})`
    ].filter(Boolean);

    if (mediaLinks.length > 0) {
      fields.push({
        name: 'Media',
        value: mediaLinks.join('\n'),
        inline: true
      });
    }

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(`${guild.name}`)
      .setThumbnail(avatarUrl)
      .addFields(fields)
      .setFooter({ text: `Guild ID: ${guild.id}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
