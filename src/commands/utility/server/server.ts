import { 
  SlashCommandBuilder,
  MessageFlags,
  type ChatInputCommandInteraction
} from 'discord.js';

import serverAvatar from '@/commands/utility/server/serverAvatar';
import serverBanner from '@/commands/utility/server/serverBanner';
import serverFirstMessage from '@/commands/utility/server/serverFirstMessage';
import serverInfo from '@/commands/utility/server/serverInfo';
import serverMembers from '@/commands/utility/server/serverMembers';
import serverSplash from '@/commands/utility/server/serverSplash';

export default {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Server utility commands')
    .addSubcommand(sub =>
      sub.setName(serverAvatar.data.name)
        .setDescription(serverAvatar.data.description)
    )
    .addSubcommand(sub =>
      sub.setName(serverBanner.data.name)
        .setDescription(serverBanner.data.description)
    )
    .addSubcommand(sub =>
      sub.setName(serverFirstMessage.data.name)
        .setDescription(serverFirstMessage.data.description)
    )
    .addSubcommand(sub =>
      sub.setName(serverInfo.data.name)
        .setDescription(serverInfo.data.description)
    )
    .addSubcommand(sub =>
      sub.setName(serverMembers.data.name)
        .setDescription(serverMembers.data.description)
    )
    .addSubcommand(sub =>
      sub.setName(serverSplash.data.name)
        .setDescription(serverSplash.data.description)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case 'avatar':
        return serverAvatar.execute(interaction);
      case 'banner':
        return serverBanner.execute(interaction);
      case 'firstmessage':
        return serverFirstMessage.execute(interaction);
      case 'info':
        return serverInfo.execute(interaction);
      case 'members':
        return serverMembers.execute(interaction);
      case 'splash':
        return serverSplash.execute(interaction);
    }

    return interaction.reply({ 
      content: 'Unknown subcommand.', 
      flags: MessageFlags.Ephemeral
    });
  }
};
