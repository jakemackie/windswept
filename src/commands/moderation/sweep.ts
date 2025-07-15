import {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
  PermissionsBitField,
} from 'discord.js';

import type {
  ChatInputCommandInteraction,
  Collection,
  Message,
  PartialMessage,
} from 'discord.js';

import { windswept } from '../../client/windswept.js';

export default {
  name: 'sweep',
  data: new SlashCommandBuilder()
    .setName('sweep')
    .setDescription('Sweeps up channel messages using a message link/id or a set amount.')
    .addStringOption(option =>
      option
        .setName('link_or_id')
        .setDescription('The message link or message ID to sweep from.')
        .setRequired(false),
    )
    .addStringOption(option =>
      option
        .setName('amount')
        .setDescription('The number of messages to sweep (1–100).')
        .setRequired(false),
    )
    .addStringOption(option =>
      option
        .setName('contains')
        .setDescription('Filter messages containing specific text.')
        .setRequired(false),
    )
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Delete messages from a specific user.')
        .setRequired(false),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    // Resolve the client & interaction user
    const client = interaction.client as windswept;
    const interactionUser = interaction.user;

    if (!interaction.guild || !interaction.channel) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription('This command can only be used in a server.');

      return await interaction.reply({ embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!interaction.channel.isTextBased() || !('bulkDelete' in interaction.channel)) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription('This command can only be used in text channels.');

      return await interaction.reply({ embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });
    }

    const member = interaction.guild.members.resolve(interaction.user.id);
    if (!member) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription('Something went wrong resolving your membership.');

      return await interaction.reply({ embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`${interactionUser} You do not have permission to \`manage_messages\`.`);
      
      return interaction.reply({ embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const link = interaction.options.getString('link_or_id');
    const amount = interaction.options.getString('amount');
    const contains = interaction.options.getString('contains');
    const user = interaction.options.getUser('user');
    let deletedMessages: Collection<string, Message | PartialMessage | undefined> | undefined;

    if (link) {
      // Extract message ID from Discord message link or use as-is if it's just an ID
      const msgId = link.includes('discord.com') 
        ? link.match(/\/(\d{17,19})\/?$/)?.[1] 
        : link.match(/^\d{17,19}$/)?.[0];
        
      if (!msgId) {
        const embed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription('Invalid message link or ID.');

        return await interaction.reply({ embeds: [embed],
          flags: MessageFlags.Ephemeral,
        });
      }

      const targetMessage = await interaction.channel.messages
        .fetch(msgId)
        .catch(() => null);

      if (!targetMessage) {
        const embed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription('Could not find the message.');

        return await interaction.reply({ embeds: [embed],
          flags: MessageFlags.Ephemeral,
        });
      }

      const messages = await interaction.channel.messages.fetch({ limit: 100 });
      const filtered = messages.filter(msg => 
        msg.createdTimestamp >= targetMessage.createdTimestamp && 
        msg.deletable &&
        (!user || msg.author.id === user.id) &&
        (!contains || msg.content.toLowerCase().includes(contains.toLowerCase()))
      );

      deletedMessages = await interaction.channel.bulkDelete(filtered, true).catch(() => undefined);
    }

    else if (amount) {
      const count = parseInt(amount);
      if (isNaN(count) || count <= 0 || count > 100) {
        const embed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription('Please provide a valid number between 1 and 100.');

        return await interaction.reply({ embeds: [embed],
          flags: MessageFlags.Ephemeral,
        });
      }

      const fetched = await interaction.channel.messages.fetch({ limit: count });
      const deletable = fetched.filter(m => 
        m.deletable && 
        (!user || m.author.id === user.id) &&
        (!contains || m.content.toLowerCase().includes(contains.toLowerCase()))
      );
      deletedMessages = await interaction.channel.bulkDelete(deletable, true).catch(() => undefined);
    }
    
    else {
      const fetched = await interaction.channel.messages.fetch({ limit: 100 });
      const deletable = fetched.filter(m => 
        m.deletable && 
        (!user || m.author.id === user.id) &&
        (!contains || m.content.toLowerCase().includes(contains.toLowerCase()))
      );
      deletedMessages = await interaction.channel.bulkDelete(deletable, true).catch(() => undefined);
    }

    if (!deletedMessages || deletedMessages.size === 0) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription('No messages were deleted. They may be too old or not deletable.');

      return await interaction.editReply({ embeds: [embed],
      });
    }

    // Build minimal, dynamic embed description
    const sweptCount = deletedMessages.size;
    const sweptUser = user ? `${user}` : '';
    const messageLink = link
      ? (link.includes('discord.com') ? link : `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${link}`)
      : '';

    let description = '';

    if (link) {
      description = `${interactionUser} swept`
        + (user ? ` ${sweptUser}` : '')
        + (contains ? ` messages containing \`${contains}\`` : ' messages')
        + ` up until ${messageLink}`;
    } else {
      description = `${interactionUser} swept`
        + (user ? ` ${sweptCount} messages from ${sweptUser}` : ` ${sweptCount} messages`)
        + (contains ? ` containing \`${contains}\`` : '');
    }

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(description);

    return await interaction.editReply({ embeds: [embed] });
  },
};
