import { 
  SlashCommandBuilder,
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags
} from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

export default {
	name: 'avatar',
	data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Fetch the avatar of the specified user, defaults to self')
    .addUserOption(option => option
      .setName('user')
      .setDescription('The user to fetch the avatar of')
      .setRequired(false)
    ),

	async execute(interaction: ChatInputCommandInteraction) {
		const user = interaction.options.getUser('user') || interaction.user;
      const avatarUrl = user.displayAvatarURL({ size: 1024 });
      const container = new ContainerBuilder();
      const mediaGallery = new MediaGalleryBuilder()
        .addItems(new MediaGalleryItemBuilder()
          .setURL(avatarUrl)
          .setDescription(`The avatar of ${user.username}`)
        );

      container.addMediaGalleryComponents(mediaGallery);

      await interaction.reply({
        components: [container],
        flags: MessageFlags.IsComponentsV2
      });
    }
};
