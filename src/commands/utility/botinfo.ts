import { 
  SlashCommandBuilder,
  ContainerBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags,
  type MessageActionRowComponentBuilder,
  type CommandInteraction
} from 'discord.js';

import { windswept } from '@/client/windswept';

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
    // const readyTimestamp = client.readyTimestamp
    //   ? Math.floor(client.readyTimestamp / 1000)
    //   : null;
    // const uptimeValue = readyTimestamp
    //   ? `<t:${readyTimestamp}:R>`
    //   : 'Not ready';

    const container = new ContainerBuilder();
    const section = new SectionBuilder();

    const heading = new TextDisplayBuilder().setContent(`## ${client.user?.username} info`);
    const description = new TextDisplayBuilder().setContent(`${client.user?.username} is a multipurpose Discord bot that makes managing your servers easier with features that boost community engagement.`)

    const thumbnail = new ThumbnailBuilder()
      .setURL(clientAvatarUrl)
      .setDescription(`${client.user?.username}'s avatar`)

    section.addTextDisplayComponents(heading, description);
    section.setThumbnailAccessory(thumbnail);
    container.addSectionComponents(section);

    const separator = new SeparatorBuilder()
      .setSpacing(SeparatorSpacingSize.Large)
    
    container.addSeparatorComponents(separator);

    // Website button ("Coming soon") / disabled
    const website = new ButtonBuilder()
      .setCustomId('website')
      .setEmoji('🔗')
      .setLabel('Website (Coming soon)')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);

    // Top.gg bot promotion button
    const topgg = new ButtonBuilder()
      .setEmoji('🗳️')
      .setLabel(`Upvote (Coming soon)`)
      .setStyle(ButtonStyle.Link)
      .setURL(`https://top.gg/bot/${client.user?.id}`)
      .setDisabled(true);

    // GitHub button
    const github = new ButtonBuilder()
      .setEmoji('⭐')
      .setLabel('GitHub')
      .setStyle(ButtonStyle.Link)
      .setURL('https://github.com/windswept-bot/windswept');

    // Combine buttons into an Action Row
    const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>()
      .addComponents(website, topgg, github);

    container.setAccentColor(client.color);
    container.addActionRowComponents(actionRow);

    await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};
