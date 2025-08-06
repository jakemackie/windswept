import {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
  PermissionsBitField,
  type ChatInputCommandInteraction
} from 'discord.js';

import { windswept } from '@/client/windswept';

export default {
  name: 'nickname',
  data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription('Set the server nickname of the provided user')
    .addUserOption(option => option
      .setName('user')
      .setDescription('The user to set the nickname for')
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName('nickname')
      .setDescription('The new nickname for the user')
      .setRequired(true)
    ),

    async execute(interaction: ChatInputCommandInteraction) {
      const client = interaction.client as windswept;

      const guild = interaction.guild;
      if (!guild) return interaction.reply({ 
        content: 'This command can only be used in a server.', 
        flags: MessageFlags.Ephemeral 
      });

      const nickname = interaction.options.getString('nickname');      
      if (!nickname) return interaction.reply({ 
        content: 'Please provide a nickname.', 
        flags: MessageFlags.Ephemeral 
      });

      const user = interaction.options.getUser('user') ?? interaction.user;
      const targetMember = interaction.guild.members.cache.get(user.id);
      const botMember = interaction.guild.members.me;

      if (!targetMember) {
        return interaction.reply({ 
          content: 'User not found in this server.', 
          flags: MessageFlags.Ephemeral 
        });
      }

      // Bot permission check
      if (!botMember?.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
        return interaction.reply({ 
          content: 'I do not have permission to manage nicknames.', 
          flags: MessageFlags.Ephemeral 
        });
      }

      // Role hierarchy check
      if (targetMember.roles.highest.position >= botMember.roles.highest.position) {
        return interaction.reply({ 
          content: 'I cannot change the nickname of this user because they have the same or higher role than me.', 
          flags: MessageFlags.Ephemeral 
        });
      }

      // User permission check
      if (!interaction.guild.members.cache.get(interaction.user.id)?.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
        return interaction.reply({ 
          content: 'You do not have permission to manage nicknames.', 
          flags: MessageFlags.Ephemeral 
        });
      }

      try {
        const previousName = targetMember.nickname || user.username;

        await targetMember.setNickname(nickname);

        const embed = new EmbedBuilder()
          .setAuthor({
            name: `${previousName} → ${nickname}`,
            iconURL: user.displayAvatarURL()
          })
          .setTitle('Nickname Changed')
          .setDescription(`${interaction.user}: Changed the nickname of ${user} to \`${nickname}\`.`)
          .setColor(client.color)

        return interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error(error);
        return interaction.reply({ content: 'There was an error setting the nickname.', flags: MessageFlags.Ephemeral });
      }
    }
}
