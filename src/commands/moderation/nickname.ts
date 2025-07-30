import {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
  PermissionsBitField,
  type ChatInputCommandInteraction
} from 'discord.js';

import { windswept } from '../../client/windswept.js';

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

      // Bot
      if (!interaction.guild.members.me?.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
        return interaction.reply({ 
          content: 'I do not have permission to manage nicknames.', 
          flags: MessageFlags.Ephemeral 
        });
      }

      // User
      if (!interaction.guild.members.cache.get(user.id)?.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
        return interaction.reply({ 
          content: 'You do not have permission to manage nicknames for this user.', 
          flags: MessageFlags.Ephemeral 
        });
      }

      try {
        const previousName = interaction.guild.members.cache.get(user.id)?.nickname || user.username;

        await interaction.guild.members.cache.get(user.id)?.setNickname(nickname);

        const embed = new EmbedBuilder()
          .setAuthor({
            name: `${previousName} → ${nickname}`,
            iconURL: interaction.user.displayAvatarURL()
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
