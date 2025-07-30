import { 
  SlashCommandBuilder,
  EmbedBuilder,
  type ChatInputCommandInteraction
} from 'discord.js';

import type { APIEmbedField } from 'discord-api-types/v10';

import { windswept } from '../../client/windswept';

export default {
  name: 'userinfo',
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Fetch the given user\'s public information')
    .addUserOption(option => option
      .setName('user')
      .setDescription('The user to fetch information for, defaults to self')
      .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const client = interaction.client as windswept;
    const user = interaction.options.getUser('user') || interaction.user;
    const member = interaction.guild?.members.cache.get(user.id);
    const color = await client.getUserColor(user);

    const fields: APIEmbedField[] = [];

    if (member?.joinedTimestamp) {
      fields.push({
        name: 'Joined',
        value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`,
        inline: true,
      });
    }

    if (user.createdTimestamp) {
      fields.push({
        name: 'Registered',
        value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
        inline: true,
      });
    }

    if (member) {
      // Roles
      const roles = member.roles.cache
        .filter(role => role.id !== interaction.guild?.id && role.name !== '@everyone')
        .map(role => `<@&${role.id}>`);

      if (roles.length > 0) {
        fields.push({
          name: `Roles (${roles.length})`,
          value: roles.join(', '),
          inline: false,
        });
      }

      // Permissions
      const permissions = client.formatPermissions(member.permissions.toArray());

      if (permissions.length > 0) {
        fields.push({
          name: 'Permissions',
          value: permissions.join(', '),
          inline: false,
        });
      }

      // Info field
      const infoBits: string[] = [];

      if (interaction.guild?.ownerId === user.id) infoBits.push('Owner');
      if (member.premiumSinceTimestamp) infoBits.push('Server Booster');
      if (user.bot) infoBits.push('Bot');

      if (infoBits.length > 0) {
        fields.push({
          name: 'Info',
          value: infoBits.join(', '),
          inline: false,
        });
      }
    }

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(user.username)
      .setThumbnail(client.getPrimaryUserAvatar(user, member))
      .addFields(fields)
      .setFooter({ text: `ID: ${user.id}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
