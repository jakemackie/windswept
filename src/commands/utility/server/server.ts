import { 
  SlashCommandBuilder,
  MessageFlags,
  type ChatInputCommandInteraction
} from 'discord.js';
import avatar from './serverAvatar.js';
import firstmessage from './serverFirstMessage.js';
import serverSplash from './serverSplash.js';

export default {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Server utility commands')
    .addSubcommand(sub =>
      sub.setName(avatar.data.name)
        .setDescription(avatar.data.description)
    )
    .addSubcommand(sub =>
      sub.setName(firstmessage.data.name)
        .setDescription(firstmessage.data.description)
    )
    .addSubcommand(sub =>
      sub.setName(serverSplash.data.name)
        .setDescription(serverSplash.data.description)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case 'avatar':
        return avatar.execute(interaction);
      case 'firstmessage':
        return firstmessage.execute(interaction);
      case 'splash':
        return serverSplash.execute(interaction);
    }

    return interaction.reply({ 
      content: 'Unknown subcommand.', 
      flags: MessageFlags.Ephemeral
    });
  }
};
