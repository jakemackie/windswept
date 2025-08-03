import { 
  SlashCommandBuilder,
  MessageFlags,
  type ChatInputCommandInteraction
} from 'discord.js';
import avatar from './serverAvatar.js';

export default {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Server utility commands')
    .addSubcommand(sub =>
      sub.setName(avatar.data.name)
        .setDescription(avatar.data.description)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'avatar') return avatar.execute(interaction);

    return interaction.reply({ 
      content: 'Unknown subcommand.', 
      flags: MessageFlags.Ephemeral
    });
  }
};
